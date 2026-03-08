import { Badge } from '@/components/ui/Badge';
import type { OrderStatus } from '@/types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const STATUS_VARIANT_MAP: Record<OrderStatus, BadgeVariant> = {
  pending: 'default',
  paid: 'info',
  scraping: 'warning',
  completed: 'success',
  failed: 'danger',
  refunded: 'default',
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status];
  return <Badge variant={variant}>{status}</Badge>;
}
