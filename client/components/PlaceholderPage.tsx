import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestion?: string;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  suggestion = "Continue exploring our homepage for more content!" 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />
      
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <Construction className="h-24 w-24 mx-auto text-neon-blue animate-pulse-glow" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-6">
            {description}
          </p>
          
          <p className="text-gray-400 mb-8">
            {suggestion}
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.history.back()}
              className="btn-secondary w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              className="btn-primary w-full"
            >
              Back to Home
            </Button>
          </div>
          
          <div className="mt-8 p-4 glass-morphism rounded-lg">
            <p className="text-sm text-gray-400">
              Have ideas for this page? Continue the conversation with our AI assistant to help build out these features!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
