import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle,
  AlertCircle,
  CalendarDays
} from "lucide-react";

interface OrderStatusProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    estimatedDelivery?: string;
    deliveredAt?: string;
    trackingNumber?: string;
    carrier?: string;
  };
}

export default function OrderStatus({ order }: OrderStatusProps) {
  const getStatusStep = (status: string): number => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'En Tránsito';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const currentStep = getStatusStep(order.status);
  const progressPercentage = (currentStep / 4) * 100;

  const steps = [
    {
      id: 0,
      label: 'Pedido Recibido',
      icon: <AlertCircle className="h-4 w-4" />,
      description: 'Tu pedido ha sido recibido y está siendo procesado',
      completed: currentStep >= 0,
      current: currentStep === 0,
    },
    {
      id: 1,
      label: 'Pago Confirmado',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'El pago ha sido procesado exitosamente',
      completed: currentStep >= 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      label: 'Preparando Envío',
      icon: <Package className="h-4 w-4" />,
      description: 'Tu pedido está siendo empacado para el envío',
      completed: currentStep >= 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      label: 'En Tránsito',
      icon: <Truck className="h-4 w-4" />,
      description: 'Tu pedido está en camino a tu dirección',
      completed: currentStep >= 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      label: 'Entregado',
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Tu pedido ha sido entregado exitosamente',
      completed: currentStep >= 4,
      current: currentStep === 4,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Status Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Estado del Pedido</h3>
        <Badge className={getStatusColor(order.status)}>
          {getStatusText(order.status)}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Recibido</span>
          <span>Entregado</span>
        </div>
      </div>

      {/* Status Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            {/* Step Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-green-500 text-white' 
                : step.current 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-300 text-gray-500'
            }`}>
              {step.icon}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${
                  step.completed ? 'text-green-700' : 
                  step.current ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {step.label}
                </h4>
                
                {/* Timestamp */}
                {step.completed && step.id === 0 && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString('es-MX')}
                  </span>
                )}
                
                {step.completed && step.id === 4 && order.deliveredAt && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {new Date(order.deliveredAt).toLocaleDateString('es-MX')}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>

              {/* Additional Information */}
              {step.current && step.id === 3 && order.trackingNumber && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <p className="font-medium text-blue-800">Información de Envío:</p>
                  <p className="text-blue-700">
                    Número de rastreo: <span className="font-mono">{order.trackingNumber}</span>
                  </p>
                  {order.carrier && (
                    <p className="text-blue-700">Transportista: {order.carrier}</p>
                  )}
                </div>
              )}

              {step.current && step.id === 3 && order.estimatedDelivery && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <p className="text-blue-700">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString('es-MX')}
                  </p>
                </div>
              )}
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className={`absolute left-5 mt-10 w-0.5 h-6 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} style={{ marginLeft: '1.25rem' }} />
            )}
          </div>
        ))}
      </div>

      {/* Estimated Delivery */}
      {order.estimatedDelivery && order.status !== 'delivered' && (
        <div className="bg-beige-light p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-brown-primary mr-2" />
            <div>
              <p className="font-medium text-gray-900">Entrega Estimada</p>
              <p className="text-gray-600">
                {new Date(order.estimatedDelivery).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Confirmation */}
      {order.status === 'delivered' && order.deliveredAt && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-800">¡Pedido Entregado!</p>
              <p className="text-green-700">
                Entregado el {new Date(order.deliveredAt).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
