import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{
          fontFamily: 'Nunito',
          fontWeight: 800,
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: 'var(--primary)',
          marginBottom: 20,
          textShadow: '2px 2px 0 var(--secondary)',
        }}>
          VISIT US
        </h1>
        <p style={{
          fontSize: 20,
          fontWeight: 400,
          color: 'var(--text)',
          opacity: 0.8,
        }}>
          We'd love to see you!
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 30,
      }}>
        {/* Location Card */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 30,
          padding: 40,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            width: 70,
            height: 70,
            marginBottom: 25,
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="fas fa-map-marker-alt" style={{ fontSize: 28, color: 'white' }}></i>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 15 }}>
            Location
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.6 }}>
            123 Coffee Street<br />
            Brew City, BC 12345
          </p>
        </div>

        {/* Hours Card */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 30,
          padding: 40,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            width: 70,
            height: 70,
            marginBottom: 25,
            background: 'var(--secondary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="fas fa-clock" style={{ fontSize: 28, color: 'white' }}></i>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 15 }}>
            Hours
          </h2>
          <div style={{ fontSize: 18, color: 'var(--text)', lineHeight: 2 }}>
            <p><strong>Mon - Fri:</strong> 7am - 7pm</p>
            <p><strong>Sat - Sun:</strong> 8am - 8pm</p>
          </div>
        </div>

        {/* Contact Card */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 30,
          padding: 40,
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            width: 70,
            height: 70,
            marginBottom: 25,
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <i className="fas fa-phone" style={{ fontSize: 28, color: 'white' }}></i>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 15 }}>
            Contact
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.8 }}>
            <i className="fas fa-phone" style={{ marginRight: 10, color: 'var(--secondary)' }}></i>
            (555) 123-4567
          </p>
          <p style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.8 }}>
            <i className="fas fa-envelope" style={{ marginRight: 10, color: 'var(--secondary)' }}></i>
            hello@goldenhour.coffee
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div style={{
        marginTop: 60,
        background: 'var(--secondary)',
        borderRadius: 30,
        padding: 50,
        textAlign: 'center',
        color: 'white',
      }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          Follow Us
        </h2>
        <p style={{ fontSize: 18, marginBottom: 30, opacity: 0.9 }}>
          Stay updated with our latest brews and events
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[
            { icon: 'fa-instagram', label: 'Instagram' },
            { icon: 'fa-facebook', label: 'Facebook' },
            { icon: 'fa-twitter', label: 'Twitter' },
            { icon: 'fa-tiktok', label: 'TikTok' },
          ].map((social, index) => (
            <a
              key={index}
              href="#"
              style={{
                width: 60,
                height: 60,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s, transform 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <i className={`fab ${social.icon}`} style={{ fontSize: 24 }}></i>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 60,
        background: 'var(--card-bg)',
        borderRadius: 30,
        padding: 50,
        textAlign: 'center',
        border: '3px solid var(--primary)',
      }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, color: 'var(--text)', marginBottom: 15 }}>
          <i className="fas fa-gift" style={{ color: 'var(--primary)', marginRight: 12 }}></i>
          First Time?
        </h2>
        <p style={{ fontSize: 18, color: 'var(--text)', opacity: 0.8, marginBottom: 25 }}>
          Mention "GOLDEN" for 15% off your first order!
        </p>
        <div style={{
          display: 'inline-block',
          background: 'var(--primary)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: 30,
          fontWeight: 800,
          fontSize: 18,
        }}>
          GOLDEN
        </div>
      </div>
    </Layout>
  );
}
