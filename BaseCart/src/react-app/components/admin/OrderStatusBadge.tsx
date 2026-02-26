interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  preparing: { bg: '#DBEAFE', color: '#1E40AF', label: 'Preparing' },
  ready: { bg: '#D1FAE5', color: '#065F46', label: 'Ready' },
  completed: { bg: '#E5E7EB', color: '#374151', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span style={{
      padding: '6px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      background: config.bg,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
}
