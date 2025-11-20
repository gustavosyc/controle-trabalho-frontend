import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  showBackButton?: boolean;
}

export default function PageHeader({ title, description, icon, showBackButton = true }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-2">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            ← Voltar
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
        >
          🏠 Dashboard
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
}
