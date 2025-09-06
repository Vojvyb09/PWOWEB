
'use client';

import { useState } from 'react';
import { AiDescriptionGenerator } from '@/components/ai-description-generator';
import type { Script } from '@/lib/types';
import { scripts as initialScripts } from "@/lib/data";

interface ScriptRunnerProps {
    script: Script;
}

export function ScriptRunner({ script: initialScript }: ScriptRunnerProps) {
    const [script, setScript] = useState<Script>(initialScript);
    
    const handleDescriptionUpdate = (newDescription: string) => {
        setScript(prev => ({ ...prev, description: newDescription }));
        // In a real app, this would also trigger a database update.
        // For now, we update the local state to see the change immediately.
        const scriptIndex = initialScripts.findIndex(s => s.id === script.id);
        if (scriptIndex !== -1) {
          initialScripts[scriptIndex].description = newDescription;
        }
    };
    
    if (script.description) {
        return <p className="text-muted-foreground">{script.description}</p>;
    }

    return <AiDescriptionGenerator script={script} onApprove={handleDescriptionUpdate} />;
}
