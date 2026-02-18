
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, FileText } from 'lucide-react';
import { Order } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const statusMap = {
    completed: { label: '已完成', variant: 'success' as const },
    pending: { label: '进行中', variant: 'warning' as const },
    cancelled: { label: '已取消', variant: 'error' as const }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">订单编号</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">客户</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">日期</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">金额</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {orders.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                className="group border-b border-gray-50 hover:bg-primary-50/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-gray-500">#{order.id}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {order.customer.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                <td className="py-3 px-4">
                  <Badge variant={statusMap[order.status].variant}>
                    {statusMap[order.status].label}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{order.amount}</td>
                <td className="py-3 px-4 text-right">
                   <div className="flex justify-end gap-2">
                     <Button size="sm" variant="ghost" className="!p-2 text-gray-400 hover:text-gray-600">
                       <FileText className="w-4 h-4" />
                     </Button>
                     <Button size="sm" variant="ghost" className="!p-2 text-gray-400 hover:text-gray-600">
                       <MoreHorizontal className="w-4 h-4" />
                     </Button>
                   </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
