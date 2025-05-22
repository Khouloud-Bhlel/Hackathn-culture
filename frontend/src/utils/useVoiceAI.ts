import { useState, useEffect, useRef } from 'react';
import { voiceToText, generateArtifactResponse, textToSpeech } from './openaiService';

interface UseVoiceAIProps {
  artifactTitle: string;
  artifactDescription: string;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}

export function useVoiceAI({ artifactTitle, artifactDescription }: UseVoiceAIProps) {
  const [isListening, setIsListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start/stop voice recording
  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          try {
            setProcessing(true);
            
            // Create audio blob from chunks
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Convert voice to text
            const transcribedText = await voiceToText(audioBlob);
            
            if (transcribedText) {
              // Add user message
              addMessage(transcribedText, true);
              
              // Generate AI response
              const aiResponse = await generateArtifactResponse(
                artifactTitle,
                artifactDescription,
                transcribedText
              );
              
              // Convert AI response to speech
              const speechBuffer = await textToSpeech(aiResponse);
              const audioUrl = createAudioUrl(speechBuffer);
              
              // Add AI response with audio URL
              addMessage(aiResponse, false, audioUrl);
              
              // Play audio automatically
              const audio = new Audio(audioUrl);
              audio.play();
            }
          } catch (err) {
            console.error('Error processing audio:', err);
            setError('حدث خطأ أثناء معالجة التسجيل الصوتي');
          } finally {
            setProcessing(false);
            
            // Close audio tracks
            if (mediaRecorderRef.current) {
              const tracks = mediaRecorderRef.current.stream.getTracks();
              tracks.forEach(track => track.stop());
            }
          }
        };

        mediaRecorderRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('لا يمكن الوصول إلى الميكروفون. يرجى التأكد من السماح بالوصول.');
      }
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  // Create audio URL from array buffer
  const createAudioUrl = (buffer: ArrayBuffer): string => {
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  };

  // Add message to chat
  const addMessage = (text: string, isUser: boolean, audioUrl?: string) => {
    setMessages(prev => [
      ...prev,
      { text, isUser, timestamp: new Date(), audioUrl }
    ]);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Revoke any created object URLs
      messages.forEach(message => {
        if (message.audioUrl) {
          URL.revokeObjectURL(message.audioUrl);
        }
      });
    };
  }, [messages]);

  return {
    isListening,
    processing,
    messages,
    error,
    toggleListening,
    addMessage
  };
}
