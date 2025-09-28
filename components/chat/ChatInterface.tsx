"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader as Loader2, User, Bot, Copy, ThumbsUp, ThumbsDown, MapPin, Download, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types';
import { MessageActions } from './MessageActions';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { QuerySuggestions } from './QuerySuggestions';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, context?: any) => void;
  isLoading: boolean;
  sessionId: string;
}

export function ChatInterface({ messages, onSendMessage, isLoading, sessionId }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    return (
      <div
        key={message.id}
        className={`flex gap-3 p-4 ${isUser ? 'justify-end' : 'justify-start'} ${isSystem ? 'opacity-75' : ''}`}
      >
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          <Card className={`p-4 ${isUser ? 'chat-message-user' : 'chat-message-assistant'} depth-shadow`}>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-inherit">
                {message.content}
              </div>
              
              {/* Confidence Score */}
              {message.confidence_score !== undefined && !isUser && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <ConfidenceIndicator score={message.confidence_score} />
                </div>
              )}
              
              {/* Query Metadata Summary */}
              {message.query_metadata && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="text-xs">
                      {message.query_metadata.data_points_returned} data points
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {message.query_metadata.execution_time}ms
                    </Badge>
                    {message.query_metadata.spatial_bounds && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Geospatial
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Actions */}
            <MessageActions 
              message={message}
              onCopy={() => navigator.clipboard.writeText(message.content)}
              onShare={() => {/* Share functionality */}}
              onExport={() => {/* Export functionality */}}
            />
          </Card>
          
          <div className={`text-xs text-slate-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div className="flex items-center gap-3 p-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="p-4 chat-message-assistant">
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing ocean data...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Query Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="border-t bg-slate-800 border-slate-700 p-4">
          <QuerySuggestions onSuggestionClick={handleSuggestionClick} />
        </div>
      )}

      {/* Input Form */}
      <div className="border-t bg-slate-800 border-slate-700 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about ocean data... e.g., 'Show me salinity profiles near the equator'"
              disabled={isLoading}
              className="pr-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-600"
            />
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setInputValue('')}
              >
                ×
              </Button>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="ocean-gradient hover:opacity-90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-slate-400 text-center">
          Tip: Try asking specific questions about locations, time periods, or ocean parameters
        </div>
      </div>
    </div>
  );
}