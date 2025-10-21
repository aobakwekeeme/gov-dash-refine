import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { useUserShop } from '../hooks/useShops';
import { useShopDocuments } from '../hooks/useDocuments';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const DOCUMENT_TYPES = [
  { value: 'business_registration', label: 'Business Registration Certificate' },
  { value: 'tax_clearance', label: 'Tax Clearance Certificate' },
  { value: 'zoning_certificate', label: 'Zoning Certificate' },
  { value: 'health_certificate', label: 'Health & Safety Certificate' },
  { value: 'trading_license', label: 'Trading License' },
  { value: 'fire_safety', label: 'Fire Safety Certificate' },
  { value: 'insurance', label: 'Insurance Certificate' },
  { value: 'other', label: 'Other Document' }
];

export default function DocumentsPage() {
  const { shop } = useUserShop();
  const { documents, loading, refetch } = useShopDocuments(shop?.id || '');
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !shop || !selectedType) {
      toast.error('Please select a document type first');
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${shop.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create document record
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          shop_id: shop.id,
          name: documentName || file.name,
          type: selectedType,
          file_url: publicUrl,
          expiry_date: expiryDate || null,
          status: 'pending'
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }

      toast.success('Document uploaded successfully');
      setSelectedType('');
      setDocumentName('');
      setExpiryDate('');
      refetch();
    } catch (error: unknown) {
      console.error('Upload error:', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message?: string }).message || 'Failed to upload document');
      } else {
        toast.error('Failed to upload document');
      }
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Upload and manage your shop documents</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Document</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select type...</option>
                {DOCUMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name (Optional)
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Custom document name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-teal-600 hover:text-teal-700 font-medium">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading || !selectedType}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">PDF, DOC, or Image files up to 5MB</p>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your Documents</h2>
          </div>
          
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {getStatusIcon(doc.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{DOCUMENT_TYPES.find(t => t.value === doc.type)?.label || doc.type}</span>
                        {doc.expiry_date && (
                          <>
                            <span>•</span>
                            <span>Expires: {new Date(doc.expiry_date).toLocaleDateString()}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      {doc.notes && (
                        <p className="text-sm text-gray-600 mt-2">Note: {doc.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-600">Upload your first document to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}