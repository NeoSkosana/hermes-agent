"use client";

import { motion } from "framer-motion";
import { Cpu, Repeat, Target, Sparkles, GitBranch, Zap } from "lucide-react";

const parsers = [
  "Hermes",
  "Qwen",
  "Mistral",
  "Llama",
  "DeepSeek",
  "Firefunction",
  "Generic XML",
];

const features = [
  {
    icon: Repeat,
    title: "Multi-Turn Loop",
    desc: "HermesAgentLoop handles iterative tool calling with configurable iteration limits",
  },
  {
    icon: Target,
    title: "Reward Signals",
    desc: "Custom reward functions for task completion, efficiency, and safety",
  },
  {
    icon: GitBranch,
    title: "Tool Call Parsers",
    desc: "Support for 7+ model-specific tool calling formats",
  },
  {
    icon: Sparkles,
    title: "Atropos Integration",
    desc: "Ready-to-use base environment for reinforcement learning",
  },
];

export function RLTraining() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-accent border border-accent/30 rounded-full bg-accent/5">
            <Cpu className="w-4 h-4" />
            Self-Improving
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            RL Training Integration
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Built-in reinforcement learning environments for training better
            tool-calling agents. Compatible with Atropos training framework.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tool call parsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Model-Specific Tool Call Parsers
              </h3>
              <p className="text-muted-foreground max-w-lg">
                Automatically detect and parse tool calls from different model
                formats, ensuring compatibility across the LLM ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsers.map((parser, i) => (
                <motion.span
                  key={parser}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                  className="px-3 py-1.5 text-sm font-medium bg-accent/10 text-accent rounded-lg border border-accent/20"
                >
                  {parser}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Training pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold mb-6 text-center">
            Training Pipeline
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {[
              { label: "Task Prompt", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              { label: "Agent Loop", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
              { label: "Tool Execution", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
              { label: "Reward Signal", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
              { label: "Policy Update", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-lg border ${step.color}`}>
                  {step.label}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-muted-foreground hidden sm:block">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
