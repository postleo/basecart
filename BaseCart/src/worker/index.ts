import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";

const app = new Hono<{ Bindings: Env }>();

// ==================== AUTH ROUTES ====================

app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });
  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();
  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);
  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// ==================== USER PROFILE ROUTES ====================

// Get user profile
app.get("/api/user/profile", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const profile = await c.env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).first();
    
    return c.json({ profile: profile || null });
  } catch (error) {
    console.error("Get profile error:", error);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Update user profile (display name)
app.patch("/api/user/profile", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { display_name } = body;

    // Store display name in a user_profiles table
    await c.env.DB.prepare(`
      INSERT INTO user_profiles (user_id, display_name, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET display_name = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(user.id, display_name, display_name).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// ==================== BUSINESS ROUTES ====================

// Get current user's business
app.get("/api/business/me", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const business = await c.env.DB.prepare(
      "SELECT * FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();
    
    if (!business) {
      return c.json({ business: null });
    }
    
    return c.json({ business });
  } catch (error) {
    console.error("Get business error:", error);
    return c.json({ error: "Failed to fetch business" }, 500);
  }
});

// Create a new business
app.post("/api/business", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { name, description, address, phone } = body;

    if (!name) {
      return c.json({ error: "Business name is required" }, 400);
    }

    // Check if business name already exists (case-insensitive)
    const nameExists = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE LOWER(name) = LOWER(?)"
    ).bind(name).first();

    if (nameExists) {
      return c.json({ error: "A business with this name already exists. Please choose a different name." }, 400);
    }

    // Check if user already has a business
    const existing = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (existing) {
      return c.json({ error: "You already have a business registered" }, 400);
    }

    // Generate slug from name
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const slugExists = await c.env.DB.prepare(
        "SELECT id FROM businesses WHERE slug = ?"
      ).bind(slug).first();
      if (!slugExists) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO businesses (name, slug, owner_user_id, description, address, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(name, slug, user.id, description || null, address || null, phone || null).run();

    return c.json({ 
      success: true, 
      businessId: result.meta.last_row_id,
      slug 
    }, 201);
  } catch (error) {
    console.error("Create business error:", error);
    return c.json({ error: "Failed to create business" }, 500);
  }
});

// Update business
app.patch("/api/business", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { name, description, address, phone, primaryColor, secondaryColor, customLinkUrl, customLinkText } = body;

    await c.env.DB.prepare(`
      UPDATE businesses 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          address = COALESCE(?, address),
          phone = COALESCE(?, phone),
          primary_color = COALESCE(?, primary_color),
          secondary_color = COALESCE(?, secondary_color),
          custom_link_url = ?,
          custom_link_text = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE owner_user_id = ?
    `).bind(
      name || null,
      description || null,
      address || null,
      phone || null,
      primaryColor || null,
      secondaryColor || null,
      customLinkUrl ?? null,
      customLinkText ?? null,
      user.id
    ).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Update business error:", error);
    return c.json({ error: "Failed to update business" }, 500);
  }
});

// Delete business and all associated data
app.delete("/api/business", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    
    // Get the business ID first
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first<{ id: number }>();

    if (!business) {
      return c.json({ error: "No business found" }, 404);
    }

    // Delete all menu items for this business
    await c.env.DB.prepare(
      "DELETE FROM menu_items WHERE business_id = ?"
    ).bind(business.id).run();

    // Delete all orders for this business
    await c.env.DB.prepare(
      "DELETE FROM orders WHERE business_id = ?"
    ).bind(business.id).run();

    // Delete the business itself
    await c.env.DB.prepare(
      "DELETE FROM businesses WHERE id = ?"
    ).bind(business.id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete business error:", error);
    return c.json({ error: "Failed to delete business" }, 500);
  }
});

// Get business by slug (public - for customer storefront)
app.get("/api/business/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const business = await c.env.DB.prepare(
      "SELECT id, name, slug, description, address, phone, primary_color, secondary_color FROM businesses WHERE slug = ?"
    ).bind(slug).first();

    if (!business) {
      return c.json({ error: "Business not found" }, 404);
    }

    return c.json({ business });
  } catch (error) {
    console.error("Get business error:", error);
    return c.json({ error: "Failed to fetch business" }, 500);
  }
});

// ==================== MENU ROUTES ====================

// Get menu items for current user's business (admin)
app.get("/api/menu", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json([]);
    }

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM menu_items WHERE business_id = ? ORDER BY category, sort_order, name"
    ).bind((business as any).id).all();

    return c.json(results);
  } catch (error) {
    console.error("Get menu error:", error);
    return c.json({ error: "Failed to fetch menu" }, 500);
  }
});

// Get menu items for a business by slug (public)
app.get("/api/store/:slug/menu", async (c) => {
  try {
    const slug = c.req.param("slug");
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE slug = ?"
    ).bind(slug).first();

    if (!business) {
      return c.json({ error: "Business not found" }, 404);
    }

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM menu_items WHERE business_id = ? AND is_available = 1 ORDER BY category, sort_order, name"
    ).bind((business as any).id).all();

    return c.json(results);
  } catch (error) {
    console.error("Get store menu error:", error);
    return c.json({ error: "Failed to fetch menu" }, 500);
  }
});

// Create menu item (admin)
app.post("/api/menu", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json({ error: "No business found" }, 400);
    }

    const body = await c.req.json();
    const { name, description, price, category, image_url, is_available } = body;

    if (!name || !price || !category) {
      return c.json({ error: "Name, price, and category are required" }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO menu_items (business_id, name, description, price, category, image_url, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      (business as any).id,
      name,
      description || null,
      price,
      category,
      image_url || null,
      is_available ? 1 : 0
    ).run();

    return c.json({ success: true, id: result.meta.last_row_id }, 201);
  } catch (error) {
    console.error("Create menu item error:", error);
    return c.json({ error: "Failed to create item" }, 500);
  }
});

// Update menu item (admin)
app.put("/api/menu/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const id = c.req.param("id");
    
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json({ error: "No business found" }, 400);
    }

    const body = await c.req.json();
    const { name, description, price, category, image_url, is_available } = body;

    await c.env.DB.prepare(`
      UPDATE menu_items 
      SET name = ?, description = ?, price = ?, category = ?, image_url = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND business_id = ?
    `).bind(
      name,
      description || null,
      price,
      category,
      image_url || null,
      is_available ? 1 : 0,
      id,
      (business as any).id
    ).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Update menu item error:", error);
    return c.json({ error: "Failed to update item" }, 500);
  }
});

// Delete menu item (admin)
app.delete("/api/menu/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const id = c.req.param("id");
    
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json({ error: "No business found" }, 400);
    }

    await c.env.DB.prepare(
      "DELETE FROM menu_items WHERE id = ? AND business_id = ?"
    ).bind(id, (business as any).id).run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete menu item error:", error);
    return c.json({ error: "Failed to delete item" }, 500);
  }
});

// Bulk import menu items from CSV (admin)
app.post("/api/menu/import", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json({ error: "No business found" }, 400);
    }

    const body = await c.req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "No items to import" }, 400);
    }

    let imported = 0;
    let errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { name, description, price, category } = item;

      if (!name || !price || !category) {
        errors.push(`Row ${i + 1}: Missing required fields (name, price, category)`);
        continue;
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        errors.push(`Row ${i + 1}: Invalid price "${price}"`);
        continue;
      }

      try {
        await c.env.DB.prepare(`
          INSERT INTO menu_items (business_id, name, description, price, category, is_available)
          VALUES (?, ?, ?, ?, ?, 1)
        `).bind(
          (business as any).id,
          name.trim(),
          description?.trim() || null,
          parsedPrice,
          category.trim()
        ).run();
        imported++;
      } catch (err) {
        errors.push(`Row ${i + 1}: Database error`);
      }
    }

    return c.json({ success: true, imported, errors });
  } catch (error) {
    console.error("Import menu error:", error);
    return c.json({ error: "Failed to import menu items" }, 500);
  }
});

// ==================== ORDER ROUTES ====================

// Create a new order (public - customers can order for a specific business)
app.post("/api/orders", async (c) => {
  try {
    const body = await c.req.json();
    const { businessId, customerName, customerPhone, customerEmail, pickupTime, notes, items } = body;

    if (!customerName || !customerPhone || !pickupTime || !items || items.length === 0) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + price * item.quantity;
    }, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Generate order number
    const orderNumber = `ORD${Date.now().toString().slice(-6)}`;

    const result = await c.env.DB.prepare(`
      INSERT INTO orders (order_number, business_id, customer_name, customer_phone, customer_email, pickup_time, notes, items, subtotal, tax, total, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `)
      .bind(
        orderNumber,
        businessId || null,
        customerName,
        customerPhone,
        customerEmail || null,
        pickupTime,
        notes || null,
        JSON.stringify(items),
        subtotal,
        tax,
        total
      )
      .run();

    // Log order creation (email notifications require EMAILS service binding)
    console.log(`New order ${orderNumber} created${businessId ? ` for business ${businessId}` : ''}`);
    if (customerEmail) {
      console.log(`Customer email: ${customerEmail} - order confirmation would be sent here`);
    }

    return c.json({ 
      success: true, 
      orderNumber,
      orderId: result.meta.last_row_id 
    }, 201);
  } catch (error) {
    console.error("Order creation error:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get all orders for current user's business (admin only)
app.get("/api/orders", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const status = c.req.query("status");
    
    // Get user's business
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json([]);
    }

    let query = "SELECT * FROM orders WHERE business_id = ?";
    const params: (string | number)[] = [(business as any).id];
    
    if (status && status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }
    
    query += " ORDER BY created_at DESC";

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Parse items JSON for each order
    const orders = results.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    return c.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Get single order (admin only)
app.get("/api/orders/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    
    const order = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?")
      .bind(id)
      .first();

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    return c.json({
      ...order,
      items: JSON.parse(order.items as string),
    });
  } catch (error) {
    console.error("Get order error:", error);
    return c.json({ error: "Failed to fetch order" }, 500);
  }
});

// Update order status (admin only)
app.patch("/api/orders/:id/status", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

    const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    await c.env.DB.prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(status, id)
      .run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);
    return c.json({ error: "Failed to update order" }, 500);
  }
});

// Get order stats for current user's business (admin only)
app.get("/api/orders/stats/summary", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    const today = new Date().toISOString().split('T')[0];
    
    // Get user's business
    const business = await c.env.DB.prepare(
      "SELECT id FROM businesses WHERE owner_user_id = ?"
    ).bind(user.id).first();

    if (!business) {
      return c.json({
        totalOrders: 0,
        todayOrders: 0,
        pendingOrders: 0,
        todayRevenue: 0,
      });
    }

    const businessId = (business as any).id;

    const [totalOrders, todayOrders, pendingOrders, todayRevenue] = await Promise.all([
      c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE business_id = ?").bind(businessId).first(),
      c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE business_id = ? AND DATE(created_at) = ?").bind(businessId, today).first(),
      c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE business_id = ? AND status IN ('pending', 'preparing')").bind(businessId).first(),
      c.env.DB.prepare("SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE business_id = ? AND DATE(created_at) = ? AND status != 'cancelled'").bind(businessId, today).first(),
    ]);

    return c.json({
      totalOrders: (totalOrders as any)?.count || 0,
      todayOrders: (todayOrders as any)?.count || 0,
      pendingOrders: (pendingOrders as any)?.count || 0,
      todayRevenue: (todayRevenue as any)?.sum || 0,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// ==================== CUSTOMER ORDER HISTORY ====================

// Track single order by order number (public)
app.get("/api/orders/track/:orderNumber", async (c) => {
  try {
    const orderNumber = c.req.param("orderNumber");

    const order = await c.env.DB.prepare(
      "SELECT id, order_number, customer_name, pickup_time, items, subtotal, tax, total, status, created_at FROM orders WHERE order_number = ?"
    ).bind(orderNumber).first();

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    return c.json({
      ...order,
      items: JSON.parse(order.items as string),
    });
  } catch (error) {
    console.error("Track order error:", error);
    return c.json({ error: "Failed to fetch order" }, 500);
  }
});

// Get order history by email or phone (public)
app.get("/api/orders/history", async (c) => {
  try {
    const email = c.req.query("email");
    const phone = c.req.query("phone");

    if (!email && !phone) {
      return c.json({ error: "Email or phone required" }, 400);
    }

    let query = "SELECT id, order_number, customer_name, pickup_time, items, subtotal, tax, total, status, created_at FROM orders WHERE ";
    const params: string[] = [];

    if (email) {
      query += "customer_email = ?";
      params.push(email);
    } else if (phone) {
      query += "customer_phone = ?";
      params.push(phone);
    }

    query += " ORDER BY created_at DESC LIMIT 20";

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    const orders = results.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    return c.json(orders);
  } catch (error) {
    console.error("Get order history error:", error);
    return c.json({ error: "Failed to fetch order history" }, 500);
  }
});

// ==================== SYSTEM ADMIN ROUTES ====================

// System admin emails - add your admin email here
const SYSTEM_ADMIN_EMAILS = ['admin@example.com'];

// Get all businesses with stats (system admin only)
app.get("/api/system-admin/businesses", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    if (!SYSTEM_ADMIN_EMAILS.includes(user.email)) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT 
        b.*,
        COALESCE(o.order_count, 0) as order_count,
        COALESCE(o.revenue, 0) as revenue
      FROM businesses b
      LEFT JOIN (
        SELECT business_id, COUNT(*) as order_count, SUM(total) as revenue
        FROM orders
        WHERE status != 'cancelled'
        GROUP BY business_id
      ) o ON b.id = o.business_id
      ORDER BY b.created_at DESC
    `).all();

    // Get owner emails
    const businesses = await Promise.all(results.map(async (biz: any) => {
      // For simplicity, we'll just show the user_id as owner. In production, you'd fetch user details.
      return {
        ...biz,
        owner_email: biz.owner_user_id,
      };
    }));

    return c.json(businesses);
  } catch (error) {
    console.error("Get businesses error:", error);
    return c.json({ error: "Failed to fetch businesses" }, 500);
  }
});

// Get platform stats (system admin only)
app.get("/api/system-admin/stats", authMiddleware, async (c) => {
  try {
    const user = c.get("user")!;
    if (!SYSTEM_ADMIN_EMAILS.includes(user.email)) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const today = new Date().toISOString().split('T')[0];

    const [totalBusinesses, totalOrders, totalRevenue, todayOrders] = await Promise.all([
      c.env.DB.prepare("SELECT COUNT(*) as count FROM businesses").first(),
      c.env.DB.prepare("SELECT COUNT(*) as count FROM orders").first(),
      c.env.DB.prepare("SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE status != 'cancelled'").first(),
      c.env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?").bind(today).first(),
    ]);

    return c.json({
      totalBusinesses: (totalBusinesses as any)?.count || 0,
      totalOrders: (totalOrders as any)?.count || 0,
      totalRevenue: (totalRevenue as any)?.sum || 0,
      todayOrders: (todayOrders as any)?.count || 0,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

export default app;
