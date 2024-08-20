/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/rQ4JU8lM7Gn
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useContext, useEffect, useRef, useState } from "react"
import { ChatContext, MessageVisibility } from "@/contexts/chat-context"
import ChatMessage from "./chat-message"
import DataLoader from "./data-loader"
import { SettingsIcon } from "lucide-react"
import { ConfigContext } from "@/contexts/config-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { PatientRecordContext } from "@/contexts/patient-record-context"
import { toast } from "sonner"


export function Chat() {

  const config = useContext(ConfigContext);
  const chatContext = useContext(ChatContext);
  const [currentMessage, setCurrentMessage] = useState('');
  const [llmProvider, setLlmProvider] = useState('chatgpt');
  const messageTextArea = useRef<HTMLTextAreaElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const [defaultChatProvider, setDefaultChatProvider] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('');
  const [showProviders, setShowProviders] = useState(false);

  const patientRecordContext = useContext(PatientRecordContext);

  useEffect(()=> {
    if (chatContext.lastMessage) {
      lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }
    async function loadConfig() {
      setDefaultChatProvider(await config?.getServerConfig('llmProviderChat') as string);
      const configOllamaUrl = await config?.getServerConfig('ollamaUrl') as string
      setOllamaUrl(configOllamaUrl);
      setShowProviders(configOllamaUrl !== null && typeof configOllamaUrl === 'string' && configOllamaUrl.startsWith('http'));

      if (chatContext.arePatientRecordsLoaded === false && !chatContext.isStreaming && await chatContext.checkApiConfig()) {
        try {
          await patientRecordContext?.sendAllRecordsToChat();
        } catch (error) {
          console.error(error);
          toast.error('Failed to load patient records into chat: ' + error);
        }
      }
    }; 
    loadConfig();

    messageTextArea.current?.focus();
  }, [chatContext.messages, chatContext.lastMessage, chatContext.isStreaming, patientRecordContext?.patientRecords]);
  

  const handleSubmit = () => {
    if (currentMessage) {
      chatContext.sendMessage({ message: { role: 'user', name: 'You', content: currentMessage}, providerName: llmProvider ?? defaultChatProvider  });
      setCurrentMessage('');
    }
  }

  return (
    <Drawer open={chatContext.chatOpen} onOpenChange={chatContext.setChatOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageCircleIcon className="w-5 h-5 text-primary" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[825px] bg-white dark:bg-zinc-950">
        <DrawerHeader>
          <DrawerTitle>Chat with AI <Button variant="ghost" onClick={(e) => { config?.setConfigDialogOpen(true); }}><SettingsIcon className="w-4 h-4" /></Button></DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col h-[500px] overflow-y-auto">
          <div className="flex-1 p-4 space-y-4">
            {chatContext.visibleMessages.slice(chatContext.visibleMessages.length > 5 ? chatContext.visibleMessages.length-5 : 0, chatContext.visibleMessages.length).map((message, index) => ( // display only last 5 messages
              <ChatMessage key={index} message={message} />
            ))}
            {chatContext.isStreaming ? (
              <div className="flex"><div className="ml-2 h-4 w-4 animate-spin rounded-full border-4 border-primary border-t-transparent" /> <span className="text-xs">AI request in progress, provider: {chatContext?.providerName}</span></div>
            ):null}
            <div id="last-message" ref={lastMessageRef}></div>
          {/* <div className="flex items-start gap-4 justify-end">
            <div className="grid gap-1 text-right">
              <div className="font-bold">You</div>
                <div className="prose text-muted-foreground">
                  <p>
                    Hi there! I'd like to learn more about the latest advances in AI technology. Can you tell me about
                    some of the exciting new developments in the field?
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Technology</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Natural Language Processing</TableCell>
                        <TableCell>Advancements in understanding and generating human-like text</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Computer Vision</TableCell>
                        <TableCell>
                          AI systems that can recognize and classify objects in images with high accuracy
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Reinforcement Learning</TableCell>
                        <TableCell>
                          AI agents that learn to make decisions by interacting with their environment
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-bold">ChatGPT</div>
                <div className="prose text-muted-foreground">
                  <p>
                    That's a great question! Some of the most exciting developments in AI include advancements in
                    natural language processing, which allow AI systems to understand and generate human-like text.
                    There have also been breakthroughs in areas like computer vision, where AI can now recognize and
                    classify objects in images with superhuman accuracy.
                  </p>
                  <p>
                    Another area of rapid progress is in reinforcement learning, where AI agents learn to make decisions
                    by interacting with their environment and receiving rewards or penalties. This has led to AI systems
                    that can master complex games and even outperform humans in certain tasks.
                  </p>
                  <img src="/placeholder.svg" width={400} height={300} alt="AI Advancements" className="rounded-md" />
                  <p>
                    Of course, there are also important ethical considerations as AI becomes more advanced and
                    influential. Ensuring that AI systems are safe, reliable, and aligned with human values is a key
                    challenge that researchers and policymakers are grappling with.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 justify-end">
              <div className="grid gap-1 text-right">
                <div className="font-bold">You</div>
                <div className="prose text-muted-foreground">
                  <p>
                    That's really fascinating, thank you for the overview! I'm particularly interested in the ethical
                    considerations around AI. What are some of the key issues that need to be addressed as the
                    technology becomes more advanced?
                  </p>
                </div>
              </div>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div> */}
          </div>
        </div>
        <DrawerFooter className="bg-muted py-2 px-4">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              name="message"
              autoFocus
              ref={messageTextArea}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              id="message"
              rows={1}
              onKeyDown={(e) => {
                if(e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit()
                }
              }}
              className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
            />
            <div className="absolute flex top-3 right-3 gap-2">
              <div className="xxs:invisible md:visible">
                <Select id="llmProvider" value={llmProvider} onValueChange={setLlmProvider}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Default: Chat GPT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="chatgpt" value="chatgpt">Cloud: Chat GPT</SelectItem>
                      {showProviders ? (
                        <SelectItem key="ollama" value="ollama">Local: Ollama</SelectItem>
                      ): null}
                    </SelectContent>
                  </Select>
                </div>

              <Button type="submit" size="icon" className="w-8 h-8" onClick={() => {
                handleSubmit();
              }}>
                <ArrowUpIcon className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
              </div>     
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}