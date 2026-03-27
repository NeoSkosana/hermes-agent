"use client";

import { motion } from "framer-motion";
import {
  Send,
  MessageCircle,
  Hash,
  Mail,
  Phone,
  Webhook,
  Server,
  MessageSquare,
  Home,
  Grid3X3,
  Smartphone,
  Radio,
  Globe,
} from "lucide-react";

const platforms = [
  { name: "Telegram", icon: Send, color: "bg-sky-500/10 text-sky-400" },
  { name: "Discord", icon: MessageCircle, color: "bg-indigo-500/10 text-indigo-400" },
  { name: "Slack", icon: Hash, color: "bg-purple-500/10 text-purple-400" },
  { name: "WhatsApp", icon: Smartphone, color: "bg-green-500/10 text-green-400" },
  { name: "Signal", icon: Radio, color: "bg-blue-500/10 text-blue-400" },
  { name: "Matrix", icon: Grid3X3, color: "bg-teal-500/10 text-teal-400" },
  { name: "Mattermost", icon: MessageSquare, color: "bg-cyan-500/10 text-cyan-400" },
  { name: "Email", icon: Mail, color: "bg-rose-500/10 text-rose-400" },
  { name: "SMS", icon: Phone, color: "bg-orange-500/10 text-orange-400" },
  { name: "DingTalk", icon: MessageCircle, color: "bg-blue-500/10 text-blue-400" },
  { name: "Home Assistant", icon: Home, color: "bg-amber-500/10 text-amber-400" },
  { name: "Webhook", icon: Webhook, color: "bg-violet-500/10 text-violet-400" },
  { name: "API Server", icon: Server, color: "bg-emerald-500/10 text-emerald-400" },
];

const providers = [
  { name: "OpenRouter", desc: "Multi-model gateway" },
  { name: "OpenAI", desc: "GPT models" },
  { name: "Anthropic", desc: "Claude models" },
  { name: "Local Models", desc: "Ollama, vLLM, llama.cpp" },
  { name: "Google", desc: "Gemini models" },
  { name: "DeepSeek", desc: "DeepSeek models" },
];

export function Platforms() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Multi-Platform Gateway
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Deploy your agent across 13 messaging platforms with a unified
            interface. Each platform adapter inherits from BasePlatformAdapter
            for consistent behavior.
          </p>
        </motion.div>

        {/* Platform grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20"
        >
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group p-5 rounded-xl bg-card border border-border hover:border-accent/30 transition-all text-center"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${platform.color} mb-3`}
              >
                <platform.icon className="w-6 h-6" />
              </div>
              <div className="font-medium text-sm">{platform.name}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Providers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Multi-Provider AI Support
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-balance">
            Seamlessly switch between AI providers without code changes.
            Supports streaming, tool calling, and prompt caching.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {providers.map((provider, i) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-card to-muted/30 border border-border text-center"
            >
              <Globe className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="font-medium text-sm">{provider.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {provider.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
