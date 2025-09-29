"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, 
  Loader as Loader2, 
  User, 
  Bot, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  MapPin, 
  Download, 
  Sparkles,
  Mic,
  Paperclip,
  Smile,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Waves
} from 'lucide-react';
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
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll to show/hide scroll-to-bottom button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && messages.length > 3);
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  // Typing indicator simulation
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        className={`group flex gap-3 p-4 hover:bg-gray-50/50 transition-colors ${
          isUser ? 'justify-end' : 'justify-start'
        } ${isSystem ? 'opacity-75' : ''}`}
      >
        {!isUser && (
          <div className="flex-shrink-0">
            <Avatar className="w-10 h-10 border-2 border-blue-100">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Waves className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'order-first' : ''}`}>
          {/* Message Header */}
          <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs font-medium text-gray-600">
              {isUser ? 'You' : 'FloatChat AI'}
            </span>
            <span className="text-xs text-gray-400">
              {formatTimestamp(message.timestamp)}
            </span>
            {message.confidence_score !== undefined && !isUser && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {Math.round(message.confidence_score * 100)}% confident
              </Badge>
            )}
          </div>

          {/* Message Content */}
          <Card className={`
            p-4 shadow-sm border transition-all duration-200 hover:shadow-md
            ${isUser 
              ? 'bg-blue-500 text-white border-blue-500 ml-auto rounded-tr-sm' 
              : 'bg-white text-gray-900 border-gray-200 mr-auto rounded-tl-sm'
            }
          `}>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              
              {/* Query Metadata Summary */}
              {message.query_metadata && !isUser && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      <MapPin className="w-3 h-3 mr-1" />
                      {message.query_metadata.data_points_returned} data points
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {message.query_metadata.execution_time}ms
                    </Badge>
                    {message.query_metadata.spatial_bounds && (
                      <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Geospatial
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Message Actions */}
          <div className={`flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? 'justify-end' : 'justify-start'
          }`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-gray-100"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy message</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isUser && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Helpful</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Not helpful</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More actions</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0">
            <Avatar className="w-10 h-10 border-2 border-gray-200">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    );
  };

  // Welcome screen for empty chat
  const renderWelcomeScreen = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Waves className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to FloatChat!</h2>
        <p className="text-gray-800 mb-6 leading-relaxed">
          I'm your AI oceanographer assistant. Ask me anything about ARGO float data, ocean conditions, 
          or marine research. I can help you explore temperature profiles, salinity data, and much more!
        </p>
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="justify-start text-left h-auto p-4"
            onClick={() => handleSuggestionClick("Show me temperature profiles in the Arabian Sea")}
          >
            <MapPin className="w-4 h-4 mr-3 text-blue-500" />
            <div>
              <div className="font-medium">Explore Ocean Data</div>
              <div className="text-sm text-gray-700">Temperature profiles in the Arabian Sea</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start text-left h-auto p-4"
            onClick={() => handleSuggestionClick("Compare salinity variations during monsoon season")}
          >
            <Sparkles className="w-4 h-4 mr-3 text-green-500" />
            <div>
              <div className="font-medium">Seasonal Analysis</div>
              <div className="text-sm text-gray-700">Salinity variations during monsoon</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start text-left h-auto p-4"
            onClick={() => handleSuggestionClick("Find unusual temperature readings in the Pacific")}
          >
            <AlertCircle className="w-4 h-4 mr-3 text-orange-500" />
            <div>
              <div className="font-medium">Anomaly Detection</div>
              <div className="text-sm text-gray-700">Unusual temperature readings</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Waves className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">FloatChat AI</h3>
              <p className="text-xs text-gray-700">
                {isLoading ? 'Analyzing data...' : 'Ready to help with ocean data'}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {messages.filter(m => m.role === 'user').length} queries
          </Badge>
        </div>
      </div>

      {/* Messages or Welcome Screen */}
      {messages.length === 0 ? (
        renderWelcomeScreen()
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 custom-scrollbar">
          <div className="space-y-1">
            {messages.map(renderMessage)}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 p-4">
                <Avatar className="w-10 h-10 border-2 border-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Waves className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[75%]">
                  <div className="text-xs font-medium text-gray-600 mb-2">FloatChat AI</div>
                  <Card className="p-4 bg-white border-gray-200 rounded-tl-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">Analyzing ocean data...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 rounded-full w-10 h-10 p-0 shadow-lg z-10"
          variant="default"
        >
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      )}

      {/* Query Suggestions */}
      {showSuggestions && messages.length > 0 && messages.length <= 2 && (
        <div className="border-t bg-gray-50 border-gray-200 p-4">
          <QuerySuggestions onSuggestionClick={handleSuggestionClick} />
        </div>
      )}

      {/* Enhanced Input Form */}
      <div className="border-t bg-white border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about ocean data..."
                disabled={isLoading}
                className="pr-16 sm:pr-24 pl-4 py-3 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-base"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {inputValue && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-gray-100"
                    onClick={() => setInputValue('')}
                  >
                    ×
                  </Button>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice input</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-gray-800 whitespace-nowrap">Quick actions:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs whitespace-nowrap flex-shrink-0"
              onClick={() => setInputValue("Show me recent temperature data")}
            >
              🌡️ Temperature
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs whitespace-nowrap flex-shrink-0"
              onClick={() => setInputValue("Analyze salinity patterns")}
            >
              🧂 Salinity
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs whitespace-nowrap flex-shrink-0"
              onClick={() => setInputValue("Find active ARGO floats")}
            >
              🌊 ARGO Floats
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs whitespace-nowrap flex-shrink-0"
              onClick={() => setInputValue("Show me depth profiles")}
            >
              📊 Depth Profiles
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}