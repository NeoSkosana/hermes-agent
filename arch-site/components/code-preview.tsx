"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExample = `# run_agent.py - Core Agent Loop
class AIAgent:
    """Orchestrates conversations with LLMs and tools."""
    
    async def run(self, user_message: str) -> str:
        # Build context from state and history
        messages = self.build_messages(user_message)
        
        while self.iterations < self.max_iterations:
            # Get LLM response with tool schemas
            response = await self.llm.chat(
                messages=messages,
                tools=self.tool_registry.get_schemas(),
                stream=True
            )
            
            # Parse and execute tool calls
            if response.tool_calls:
                results = await self.execute_tools(
                    response.tool_calls,
                    parallel=True  # Safe parallel execution
                )
                messages.extend(results)
            else:
                # Final response - save and return
                await self.state.save_turn(response)
                return response.content
        
        return "Iteration limit reached"`;

const fileStructure = `hermes-agent/
├── run_agent.py          # Core AIAgent class
├── hermes_state.py       # Session persistence
├── model_tools.py        # Tool execution engine
│
├── hermes_cli/           # Interactive CLI
│   └── main.py
│
├── gateway/              # Multi-platform messaging
│   ├── run.py            # Gateway daemon
│   ├── config.py         # Platform configs
│   └── platforms/        # 13 platform adapters
│       └── base.py       # BasePlatformAdapter
│
├── tools/                # 40+ tool implementations
│   └── registry.py       # @register_tool decorator
│
├── environments/         # RL training (Atropos)
│   ├── hermes_base_env.py
│   └── agent_loop.py
│
├── acp_adapter/          # IDE integration
├── honcho_integration/   # Cross-session memory
└── cron/                 # Scheduled jobs
    └── jobs.py`;

export function CodePreview() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Clean, Extensible Code
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Well-structured Python codebase with clear separation of concerns.
            Easy to extend with new tools, platforms, and capabilities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Example */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => copyToClipboard(codeExample, "code")}
                className="p-2 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
              >
                {copied === "code" ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="code-block rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">
                  run_agent.py
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="font-mono text-muted-foreground">
                  {codeExample.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none">
                        {i + 1}
                      </span>
                      <span
                        className={
                          line.trim().startsWith("#")
                            ? "text-emerald-400/80"
                            : line.includes("class ") ||
                                line.includes("async def") ||
                                line.includes("def ")
                              ? "text-cyan-400"
                              : line.includes('"""')
                                ? "text-amber-400/80"
                                : "text-foreground/80"
                        }
                      >
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>

          {/* File Structure */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => copyToClipboard(fileStructure, "structure")}
                className="p-2 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
              >
                {copied === "structure" ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="code-block rounded-2xl overflow-hidden h-full">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">
                  Project Structure
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="font-mono">
                  {fileStructure.split("\n").map((line, i) => (
                    <div key={i}>
                      <span
                        className={
                          line.includes("#")
                            ? "text-muted-foreground"
                            : line.includes("/")
                              ? "text-cyan-400"
                              : line.includes(".py")
                                ? "text-emerald-400"
                                : "text-foreground/60"
                        }
                      >
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
