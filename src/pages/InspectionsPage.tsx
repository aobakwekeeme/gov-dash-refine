import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useUserShop } from '../hooks/useShops';
import { useShopInspections } from '../hooks/useInspections';

export default function InspectionsPage() {
  const { shop } = useUserShop();
  const { inspections, loading } = useShopInspections(shop?.id || '');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'scheduled': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'in_progress': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspections</h1>
          <p className="text-gray-600">View your shop inspection history and upcoming inspections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Inspections</p>
                <p className="text-3xl font-bold text-gray-900">{inspections.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-teal-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">
                  {inspections.filter(i => i.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {inspections.filter(i => i.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Inspection History</h2>
          </div>

          <div className="divide-y">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {getStatusIcon(inspection.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{inspection.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(inspection.status)}`}>
                          {inspection.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Scheduled: {new Date(inspection.scheduled_date).toLocaleDateString('en-ZA', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                        {inspection.completed_date && (
                          <p>Completed: {new Date(inspection.completed_date).toLocaleDateString('en-ZA', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                        )}
                        {inspection.notes && (
                          <p className="mt-2 text-gray-700">Notes: {inspection.notes}</p>
                        )}
                      </div>

                      {inspection.score !== null && inspection.score !== undefined && (
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Score:</span>
                          <div className="flex items-center">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  (inspection.score ?? 0) >= 80 ? 'bg-green-500' :
                                  (inspection.score ?? 0) >= 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${inspection.score ?? 0}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-semibold text-gray-900">
                              {inspection.score ?? 0}/100
                            </span>
                          </div>
                        </div>
                      )}

                      {inspection.issues && inspection.issues.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Issues Found:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {inspection.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-red-600">{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {inspections.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections yet</h3>
                <p className="text-gray-600">Inspection records will appear here once scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}