'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateDescriptionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Script } from '@/lib/types';

interface AiDescriptionGeneratorProps {
  script: Script;
  onApprove: (description: string) => void;
}

export function AiDescriptionGenerator({ script, onApprove }: AiDescriptionGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedDescription('');

    if (!script.codebase || !script.managerInstructions) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Cannot generate description without codebase and manager instructions.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = generateDescriptionAction({
        codebase: script.codebase,
        instructions: script.managerInstructions,
      });
      setGeneratedDescription(result.description);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An error occurred while generating the description.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    onApprove(generatedDescription);
    setGeneratedDescription('');
    toast({
      title: "Success!",
      description: "Script description has been updated.",
    });
  }

  if (generatedDescription) {
    return (
        <Card className="mt-6 bg-secondary/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI-Generated Description
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea 
                    value={generatedDescription}
                    onChange={(e) => setGeneratedDescription(e.target.value)}
                    rows={5}
                    className="bg-background"
                    aria-label="AI Generated Description"
                />
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="ghost" onClick={() => setGeneratedDescription('')}>Cancel</Button>
                <Button onClick={handleApprove}>Approve & Save</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-dashed border-accent p-6 text-center">
      <Sparkles className="mx-auto h-10 w-10 text-accent" />
      <h3 className="mt-2 font-semibold">Missing Description</h3>
      <p className="mt-1 text-sm text-muted-foreground">This script doesn't have a description yet.</p>
      <Button onClick={handleGenerate} disabled={isLoading} className="mt-4">
        {isLoading ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Generating...' : 'Generate with AI'}
      </Button>
    </div>
  );
}
