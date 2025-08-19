import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload, FileText, Image, Download, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Uploads() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: uploads, error } = useQuery({
    queryKey: ["/api/uploads"],
    retry: false,
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recurring-payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: data.message || "Files uploaded successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [error, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" />;
      case 'processing':
        return <Clock className="text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="text-red-600" />;
      default:
        return <Clock className="text-gray-600" />;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="text-blue-600" />;
    }
    return <Image className="text-orange-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-claude-gray-900 mb-2">Your Uploads</h2>
        <p className="text-claude-gray-600">View and manage your uploaded bank statements and analysis results.</p>
      </div>

      {/* Upload Area */}
      <Card className="bg-white rounded-xl border border-claude-gray-200 mb-6">
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-claude-gray-300 rounded-lg p-8 text-center">
            <CloudUpload className="text-4xl text-claude-gray-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-claude-gray-900 mb-2">Upload Bank Statements</h3>
            <p className="text-claude-gray-600 mb-4">Upload PDF, JPG, or PNG files. Minimum 2 months required for accurate analysis.</p>
            <Button 
              onClick={handleFileSelect}
              disabled={uploadMutation.isPending}
              className="bg-claude-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-claude-gray-800 transition-colors"
              data-testid="button-upload-files"
            >
              {uploadMutation.isPending ? "Uploading..." : "Choose Files"}
            </Button>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              multiple 
              onChange={handleFileChange}
              data-testid="input-file-upload"
            />
            <p className="text-sm text-claude-gray-500 mt-2">Maximum file size: 10MB per file</p>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card className="bg-white rounded-xl border border-claude-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-claude-gray-900">Upload History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {Array.isArray(uploads) && uploads.length > 0 ? (
            <div className="divide-y divide-claude-gray-200">
              {uploads.map((upload: any) => (
                <div key={upload.id} className="p-6 hover:bg-claude-gray-50 transition-colors" data-testid={`upload-${upload.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        {getFileIcon(upload.fileType)}
                      </div>
                      <div>
                        <h4 className="font-medium text-claude-gray-900">{upload.fileName}</h4>
                        <p className="text-sm text-claude-gray-600">
                          Uploaded {new Date(upload.uploadDate).toLocaleDateString()} • {formatFileSize(upload.fileSize)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant="secondary"
                        className={`
                          ${upload.analysisStatus === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${upload.analysisStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${upload.analysisStatus === 'failed' ? 'bg-red-100 text-red-800' : ''}
                          ${upload.analysisStatus === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                        `}
                      >
                        {getStatusIcon(upload.analysisStatus)}
                        <span className="ml-1 capitalize">{upload.analysisStatus}</span>
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-claude-gray-500 hover:text-claude-gray-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {upload.analysisResults && upload.analysisStatus === 'completed' && (
                    <div className="mt-4 p-3 bg-claude-gray-50 rounded-lg">
                      <p className="text-sm text-claude-gray-700">
                        <strong>Analysis Results:</strong> Found {upload.analysisResults.totalRecurringPayments} recurring payments totaling ${upload.analysisResults.monthlyTotal}/month.
                        {upload.analysisResults.detectedPayments && upload.analysisResults.detectedPayments.length > 0 && (
                          <span> Detected {upload.analysisResults.detectedPayments.map((p: any) => p.merchantName).join(', ')}.</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-claude-gray-500">No uploads yet. Upload your first bank statement to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
