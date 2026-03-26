# Hermes Agent - Complete Architecture Documentation

## Executive Summary

**Hermes Agent** is a self-improving AI agent built by Nous Research. It features a modular architecture designed for:
- Multi-platform messaging (Telegram, Discord, Slack, WhatsApp, Signal, etc.)
- Tool-calling with 40+ built-in tools
- Learning loops with skill creation and memory persistence
- Research-ready RL training environments (Atropos integration)
- Multiple LLM provider support (OpenRouter, OpenAI, Anthropic, local models)

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    HERMES AGENT                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              ENTRY POINTS                                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    │
│  │  │ hermes   │  │ gateway/ │  │ acp_     │  │ batch_   │  │ environments/    │   │    │
│  │  │ CLI      │  │ run.py   │  │ adapter/ │  │ runner   │  │ (Atropos RL)     │   │    │
│  │  │          │  │          │  │          │  │          │  │                  │   │    │
│  │  │hermes_cli│  │Gateway   │  │ACP Server│  │Trajectory│  │HermesAgentLoop   │   │    │
│  │  │/main.py  │  │Runner    │  │(Editor)  │  │Generator │  │HermesBaseEnv     │   │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │    │
│  └───────┼─────────────┼────────────┼─────────────┼──────────────────┼─────────────┘    │
│          │             │            │             │                  │                   │
│          └─────────────┴────────────┴─────────────┴──────────────────┘                   │
│                                         │                                                │
│                                         ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              CORE AGENT ENGINE                                   │    │
│  │                                                                                  │    │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │    │
│  │  │                         run_agent.py - AIAgent                            │  │    │
│  │  │                                                                           │  │    │
│  │  │  • Conversation orchestration (multi-turn tool calling)                   │  │    │
│  │  │  • Provider abstraction (OpenRouter, OpenAI, Anthropic, local)            │  │    │
│  │  │  • Parallel tool execution with safety guards                             │  │    │
│  │  │  • Session management and iteration budgeting                             │  │    │
│  │  │  • Prompt caching (Anthropic) and reasoning extraction                    │  │    │
│  │  │  • Subagent delegation (execute_code, delegate_task)                      │  │    │
│  │  │                                                                           │  │    │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │    │
│  │                                         │                                        │    │
│  │            ┌────────────────────────────┼────────────────────────────┐          │    │
│  │            ▼                            ▼                            ▼          │    │
│  │  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐   │    │
│  │  │  agent/         │         │  model_tools.py │         │  agent/         │   │    │
│  │  │                 │         │                 │         │                 │   │    │
│  │  │ prompt_builder  │         │ Tool Discovery  │         │ context_        │   │    │
│  │  │ prompt_caching  │         │ Tool Dispatch   │         │ compressor      │   │    │
│  │  │ model_metadata  │         │ Toolset Filter  │         │                 │   │    │
│  │  │ usage_pricing   │         │                 │         │ (LLM-based)     │   │    │
│  │  │ display         │         │                 │         │                 │   │    │
│  │  └─────────────────┘         └────────┬────────┘         └─────────────────┘   │    │
│  │                                       │                                         │    │
│  └───────────────────────────────────────┼─────────────────────────────────────────┘    │
│                                          │                                               │
│                                          ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              TOOL SYSTEM                                         │    │
│  │                                                                                  │    │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐   │    │
│  │  │                    tools/registry.py - ToolRegistry                      │   │    │
│  │  │                                                                          │   │    │
│  │  │  • Central registration: schema, handler, toolset, availability check    │   │    │
│  │  │  • OpenAI-format schema generation                                       │   │    │
│  │  │  • Async/sync dispatch with error handling                               │   │    │
│  │  └──────────────────────────────────────────────────────────────────────────┘   │    │
│  │                                         │                                        │    │
│  │  ┌──────────────────────────────────────┼──────────────────────────────────┐    │    │
│  │  │                          TOOL MODULES                                   │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │    │    │
│  │  │  │ terminal   │ │ file       │ │ web        │ │ browser    │           │    │    │
│  │  │  │ _tool      │ │ _tools     │ │ _tools     │ │ _tool      │           │    │    │
│  │  │  │            │ │            │ │            │ │            │           │    │    │
│  │  │  │ • terminal │ │ • read_file│ │ • web_     │ │ • browser_ │           │    │    │
│  │  │  │   (exec)   │ │ • write_   │ │   search   │ │   navigate │           │    │    │
│  │  │  │            │ │   file     │ │ • web_     │ │ • browser_ │           │    │    │
│  │  │  │ Backends:  │ │ • patch    │ │   extract  │ │   click    │           │    │    │
│  │  │  │ local,     │ │ • search_  │ │            │ │ • etc.     │           │    │    │
│  │  │  │ docker,    │ │   files    │ │            │ │            │           │    │    │
│  │  │  │ modal,     │ │            │ │            │ │ (agent-    │           │    │    │
│  │  │  │ daytona,   │ │            │ │            │ │  browser)  │           │    │    │
│  │  │  │ ssh,       │ │            │ │            │ │            │           │    │    │
│  │  │  │ singularity│ │            │ │            │ │            │           │    │    │
│  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │    │    │
│  │  │  │ vision     │ │ skills     │ │ memory     │ │ delegate   │           │    │    │
│  │  │  │ _tools     │ │ _tool      │ │ _tool      │ │ _tool      │           │    │    │
│  │  │  │            │ │            │ │            │ │            │           │    │    │
│  │  │  │ • vision_  │ │ • skills_  │ │ • memory   │ │ • delegate │           │    │    │
│  │  │  │   analyze  │ │   list     │ │   (store/  │ │   _task    │           │    │    │
│  │  │  │            │ │ • skill_   │ │   recall)  │ │            │           │    │    │
│  │  │  │            │ │   view     │ │            │ │ • execute_ │           │    │    │
│  │  │  │            │ │ • skill_   │ │            │ │   code     │           │    │    │
│  │  │  │            │ │   manage   │ │            │ │            │           │    │    │
│  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │    │    │
│  │  │  │ cronjob    │ │ image_gen  │ │ tts        │ │ mcp        │           │    │    │
│  │  │  │ _tools     │ │ _tool      │ │ _tool      │ │ _tool      │           │    │    │
│  │  │  │            │ │            │ │            │ │            │           │    │    │
│  │  │  │ • cronjob  │ │ • image_   │ │ • text_to_ │ │ • MCP      │           │    │    │
│  │  │  │   (CRUD)   │ │   generate │ │   speech   │ │   servers  │           │    │    │
│  │  │  │            │ │ (fal.ai)   │ │ (ElevenLabs│ │   (dynamic)│           │    │    │
│  │  │  │            │ │            │ │  / OpenAI) │ │            │           │    │    │
│  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐           │    │    │
│  │  │  │ todo       │ │ clarify    │ │ session_   │ │ honcho     │           │    │    │
│  │  │  │ _tool      │ │ _tool      │ │ search     │ │ _tools     │           │    │    │
│  │  │  │            │ │            │ │ _tool      │ │            │           │    │    │
│  │  │  │ • todo     │ │ • clarify  │ │ • session_ │ │ • honcho_  │           │    │    │
│  │  │  │   (manage  │ │   (ask     │ │   search   │ │   context  │           │    │    │
│  │  │  │    tasks)  │ │   user)    │ │   (FTS5)   │ │ • honcho_  │           │    │    │
│  │  │  │            │ │            │ │            │ │   profile  │           │    │    │
│  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘           │    │    │
│  │  └─────────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              GATEWAY (MESSAGING)                                 │    │
│  │                                                                                  │    │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │    │
│  │  │                      gateway/run.py - GatewayRunner                       │  │    │
│  │  │                                                                           │  │    │
│  │  │  • Platform adapter lifecycle management                                  │  │    │
│  │  │  • Message routing to/from AIAgent                                        │  │    │
│  │  │  • Session caching for prompt caching efficiency                          │  │    │
│  │  │  • Interrupt handling (/stop, new message interrupts)                     │  │    │
│  │  │  • DM pairing for security (code-based authorization)                     │  │    │
│  │  │  • Voice mode (TTS responses)                                             │  │    │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │    │
│  │                                         │                                        │    │
│  │  ┌──────────────────────────────────────┼──────────────────────────────────┐    │    │
│  │  │                    PLATFORM ADAPTERS (gateway/platforms/)               │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │    │    │
│  │  │  │telegram  │ │discord   │ │slack     │ │whatsapp  │ │signal    │      │    │    │
│  │  │  │.py       │ │.py       │ │.py       │ │.py       │ │.py       │      │    │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │    │    │
│  │  │  │matrix    │ │mattermost│ │email     │ │sms       │ │homeassist│      │    │    │
│  │  │  │.py       │ │.py       │ │.py       │ │.py       │ │ant.py    │      │    │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                                │    │    │
│  │  │  │api_server│ │webhook   │ │dingtalk  │  All inherit from:             │    │    │
│  │  │  │.py       │ │.py       │ │.py       │  BasePlatformAdapter           │    │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘  (gateway/platforms/base.py)   │    │    │
│  │  │                                                                         │    │    │
│  │  └─────────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              PERSISTENCE LAYER                                   │    │
│  │                                                                                  │    │
│  │  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐         │    │
│  │  │ hermes_state.py    │  │ gateway/session.py │  │ cron/jobs.py       │         │    │
│  │  │                    │  │                    │  │                    │         │    │
│  │  │ SessionDB          │  │ SessionStore       │  │ Job CRUD           │         │    │
│  │  │ • SQLite + FTS5    │  │ • JSONL per-session│  │ • jobs.json        │         │    │
│  │  │ • Message history  │  │ • Platform-specific│  │ • Schedule parsing │         │    │
│  │  │ • Token tracking   │  │ • Context window   │  │ • Cron expressions │         │    │
│  │  │ • Cost accounting  │  │                    │  │                    │         │    │
│  │  └────────────────────┘  └────────────────────┘  └────────────────────┘         │    │
│  │                                                                                  │    │
│  │  ┌────────────────────┐  ┌────────────────────┐                                 │    │
│  │  │ ~/.hermes/         │  │ honcho_integration/│                                 │    │
│  │  │                    │  │                    │                                 │    │
│  │  │ • config.yaml      │  │ HonchoSession      │                                 │    │
│  │  │ • .env             │  │ Manager            │                                 │    │
│  │  │ • state.db         │  │ • Cross-session    │                                 │    │
│  │  │ • skills/          │  │   user modeling    │                                 │    │
│  │  │ • sessions/        │  │ • Dialectic memory │                                 │    │
│  │  │ • cron/            │  │                    │                                 │    │
│  │  └────────────────────┘  └────────────────────┘                                 │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              RL TRAINING (ATROPOS)                               │    │
│  │                                                                                  │    │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │    │
│  │  │                    environments/hermes_base_env.py                        │  │    │
│  │  │                                                                           │  │    │
│  │  │  HermesAgentBaseEnv (BaseEnv subclass)                                    │  │    │
│  │  │  • Two-mode operation (Phase 1: OpenAI, Phase 2: VLLM ManagedServer)      │  │    │
│  │  │  • Toolset distribution sampling                                          │  │    │
│  │  │  • ToolContext for reward functions                                       │  │    │
│  │  │  • ScoredDataGroup construction for GRPO                                  │  │    │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │    │
│  │                                         │                                        │    │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │    │
│  │  │                    environments/agent_loop.py                             │  │    │
│  │  │                                                                           │  │    │
│  │  │  HermesAgentLoop                                                          │  │    │
│  │  │  • Multi-turn tool calling loop (OpenAI spec)                             │  │    │
│  │  │  • Reasoning extraction from responses                                    │  │    │
│  │  │  • Tool error tracking for reward signals                                 │  │    │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │    │
│  │                                         │                                        │    │
│  │  ┌──────────────────────────────────────┼──────────────────────────────────┐    │    │
│  │  │                    CONCRETE ENVIRONMENTS                                │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │    │    │
│  │  │  │terminal_test_  │  │hermes_swe_env/ │  │web_research_   │            │    │    │
│  │  │  │env/            │  │                │  │env.py          │            │    │    │
│  │  │  │                │  │ SWE-bench      │  │                │            │    │    │
│  │  │  │ Simple file    │  │ style tasks    │  │ Web research   │            │    │    │
│  │  │  │ creation tasks │  │ with Modal     │  │ tasks          │            │    │    │
│  │  │  └────────────────┘  └────────────────┘  └────────────────┘            │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌──────────────────────────────────────────────────────────────┐      │    │    │
│  │  │  │                    BENCHMARKS                                │      │    │    │
│  │  │  │                                                              │      │    │    │
│  │  │  │  • terminalbench_2/  - Terminal-Bench 2.0 evaluation         │      │    │    │
│  │  │  │  • tblite/           - TBLite benchmark                      │      │    │    │
│  │  │  │  • yc_bench/         - YC Bench                              │      │    │    │
│  │  │  └──────────────────────────────────────────────────────────────┘      │    │    │
│  │  │                                                                         │    │    │
│  │  │  ┌──────────────────────────────────────────────────────────────┐      │    │    │
│  │  │  │              TOOL CALL PARSERS (Phase 2 client-side)         │      │    │    │
│  │  │  │                                                              │      │    │    │
│  │  │  │  environments/tool_call_parsers/                             │      │    │    │
│  │  │  │  • hermes_parser.py   (Hermes-style XML tool calls)          │      │    │    │
│  │  │  │  • qwen_parser.py     (Qwen function calling)                │      │    │    │
│  │  │  │  • mistral_parser.py  (Mistral tool use)                     │      │    │    │
│  │  │  │  • llama_parser.py    (Llama 3.x)                            │      │    │    │
│  │  │  │  • deepseek_v3_parser.py                                     │      │    │    │
│  │  │  │  • kimi_k2_parser.py                                         │      │    │    │
│  │  │  │  • etc.                                                      │      │    │    │
│  │  │  └──────────────────────────────────────────────────────────────┘      │    │    │
│  │  └─────────────────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              SKILLS SYSTEM                                       │    │
│  │                                                                                  │    │
│  │  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐         │    │
│  │  │ skills/            │  │ optional-skills/   │  │ Skills Hub         │         │    │
│  │  │                    │  │                    │  │                    │         │    │
│  │  │ Built-in skills:   │  │ • blockchain/      │  │ agentskills.io     │         │    │
│  │  │ • creative/        │  │ • devops/          │  │ Open standard      │         │    │
│  │  │ • productivity/    │  │ • email/           │  │ for agent skills   │         │    │
│  │  │ • research/        │  │ • security/        │  │                    │         │    │
│  │  │ • media/           │  │ • mcp/             │  │                    │         │    │
│  │  │ • mlops/           │  │                    │  │                    │         │    │
│  │  └────────────────────┘  └────────────────────┘  └────────────────────┘         │    │
│  │                                                                                  │    │
│  │  Skill Structure:                                                               │    │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐   │    │
│  │  │  skill-name/                                                             │   │    │
│  │  │  ├── SKILL.md          # Instructions injected into system prompt        │   │    │
│  │  │  ├── DESCRIPTION.md    # Human-readable description for listing          │   │    │
│  │  │  ├── scripts/          # Python/Node scripts the agent can execute       │   │    │
│  │  │  └── templates/        # Optional code templates                          │   │    │
│  │  └──────────────────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              CRON SCHEDULER                                      │    │
│  │                                                                                  │    │
│  │  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐         │    │
│  │  │ cron/scheduler.py  │  │ cron/jobs.py       │  │ gateway/delivery.py│         │    │
│  │  │                    │  │                    │  │                    │         │    │
│  │  │ CronScheduler      │  │ Job CRUD           │  │ DeliveryRouter     │         │    │
│  │  │ • Async job loop   │  │ • parse_schedule() │  │ • Route outputs to │         │    │
│  │  │ • Due job detection│  │ • compute_next_run │  │   platforms        │         │    │
│  │  │ • AIAgent invocator│  │ • croniter support │  │ • Origin tracking  │         │    │
│  │  └────────────────────┘  └────────────────────┘  └────────────────────┘         │    │
│  │                                                                                  │    │
│  │  Schedule types: "30m", "every 2h", "0 9 * * *", "2026-02-03T14:00"             │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              ACP ADAPTER (Editor Integration)                    │    │
│  │                                                                                  │    │
│  │  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐         │    │
│  │  │ acp_adapter/       │  │ acp_adapter/       │  │ acp_adapter/       │         │    │
│  │  │ server.py          │  │ session.py         │  │ tools.py           │         │    │
│  │  │                    │  │                    │  │                    │         │    │
│  │  │ ACPServer          │  │ Session management │  │ ACP tool exposure  │         │    │
│  │  │ • JSON-RPC server  │  │ for editors        │  │                    │         │    │
│  │  │ • Editor protocol  │  │                    │  │                    │         │    │
│  │  └────────────────────┘  └────────────────────┘  └────────────────────┘         │    │
│  │                                                                                  │    │
│  │  Entry: `hermes acp` - Runs ACP server for IDE/editor integration               │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Entry Points

| Entry Point | File | Purpose |
|------------|------|---------|
| **CLI** | `hermes_cli/main.py` | Interactive terminal chat, setup wizard, model switching |
| **Gateway** | `gateway/run.py` | Multi-platform messaging daemon |
| **ACP Adapter** | `acp_adapter/` | Editor/IDE integration via Agent Communication Protocol |
| **Batch Runner** | `batch_runner.py` | Trajectory generation for training data |
| **RL Environments** | `environments/` | Atropos integration for RL training |

### 2. Core Agent Engine (`run_agent.py`)

The `AIAgent` class is the heart of Hermes:

```python
class AIAgent:
    """AI Agent with tool calling capabilities."""
    
    def __init__(
        self,
        base_url: str,           # LLM API endpoint
        api_key: str,            # Authentication
        provider: str,           # openrouter, openai, anthropic, etc.
        model: str,              # Model identifier
        max_iterations: int,     # Tool calling budget
        enabled_toolsets: List[str],
        # ... many more options
    ):
        pass
    
    def run_conversation(
        self, 
        user_message: str,
        conversation_history: List[Dict],
    ) -> str:
        """Main conversation loop with tool calling."""
        pass
```

**Key Features:**
- **Multi-provider support**: OpenRouter (200+ models), OpenAI, Anthropic, local endpoints
- **Parallel tool execution**: Safe concurrent execution with path-scoped isolation
- **Iteration budgeting**: Shared budget across parent and subagents
- **Prompt caching**: Anthropic cache_control optimization
- **Reasoning extraction**: Handles `<think>` blocks, reasoning_content, etc.

### 3. Tool System

#### Tool Registry (`tools/registry.py`)

```python
class ToolRegistry:
    """Singleton registry that collects tool schemas + handlers."""
    
    def register(
        self,
        name: str,           # Tool name (e.g., "terminal")
        toolset: str,        # Grouping (e.g., "terminal")
        schema: dict,        # OpenAI function schema
        handler: Callable,   # Execution function
        check_fn: Callable,  # Availability check
        is_async: bool,      # Async handler?
    ):
        pass
    
    def dispatch(self, name: str, args: dict, **kwargs) -> str:
        """Execute a tool handler by name."""
        pass
```

#### Available Tools (40+)

| Toolset | Tools | Description |
|---------|-------|-------------|
| **terminal** | `terminal` | Command execution (6 backends) |
| **file** | `read_file`, `write_file`, `patch`, `search_files` | File operations |
| **web** | `web_search`, `web_extract` | Web research |
| **browser** | `browser_navigate`, `browser_click`, `browser_type`, etc. | Full browser automation |
| **vision** | `vision_analyze` | Image analysis |
| **skills** | `skills_list`, `skill_view`, `skill_manage` | Skill management |
| **memory** | `memory` | Persistent memory store/recall |
| **delegate** | `delegate_task`, `execute_code` | Subagent spawning |
| **cron** | `cronjob` | Scheduled task CRUD |
| **tts** | `text_to_speech` | Voice synthesis |
| **image_gen** | `image_generate` | Image generation (fal.ai) |
| **mcp** | (dynamic) | MCP server tools |
| **honcho** | `honcho_context`, `honcho_profile`, etc. | Cross-session memory |

### 4. Gateway (Messaging Platforms)

#### GatewayRunner (`gateway/run.py`)

```python
class GatewayRunner:
    """Main gateway controller."""
    
    def __init__(self, config: GatewayConfig):
        self.adapters: Dict[Platform, BasePlatformAdapter] = {}
        self.session_store = SessionStore(...)
        self.delivery_router = DeliveryRouter(...)
        self._agent_cache: Dict[str, AIAgent] = {}  # Prompt caching
    
    async def start(self):
        """Start all configured platform adapters."""
        pass
```

#### Platform Adapters

All adapters inherit from `BasePlatformAdapter`:

```python
class BasePlatformAdapter(ABC):
    @abstractmethod
    async def connect(self) -> bool: pass
    
    @abstractmethod
    async def disconnect(self) -> None: pass
    
    @abstractmethod
    async def send(self, chat_id: str, content: str, ...) -> SendResult: pass
```

**Supported Platforms:**
- Telegram, Discord, Slack, WhatsApp, Signal
- Matrix, Mattermost, Email, SMS, DingTalk
- Home Assistant, Webhook, API Server

### 5. Persistence Layer

#### Session Database (`hermes_state.py`)

```python
class SessionDB:
    """SQLite-backed session storage with FTS5 search."""
    
    # Schema includes:
    # - sessions: id, source, model, tokens, cost tracking
    # - messages: role, content, tool_calls, reasoning
    # - messages_fts: Full-text search virtual table
```

#### Configuration (`~/.hermes/`)

```
~/.hermes/
├── config.yaml      # Main configuration
├── .env             # API keys and secrets
├── state.db         # SQLite session database
├── skills/          # User-installed skills
├── sessions/        # JSONL session files
├── cron/            # Cron jobs and output
│   ├── jobs.json
│   └── output/
├── auth.json        # OAuth credentials
└── gateway.json     # Legacy gateway config
```

### 6. RL Training (Atropos Integration)

#### Environment Structure

```python
class HermesAgentBaseEnv(BaseEnv):
    """Abstract base for Atropos environments."""
    
    env_config_cls = HermesAgentEnvConfig
    
    # Two-mode operation:
    # Phase 1: OpenAI server (SFT data gen, eval)
    # Phase 2: VLLM ManagedServer (full RL with token tracking)
    
    async def collect_trajectory(self, item: Item) -> ScoredDataItem:
        """Run a single rollout with reward computation."""
        pass
    
    @abstractmethod
    def compute_reward(self, ctx: ToolContext, result: AgentResult) -> float:
        """Subclass implements reward function."""
        pass
```

#### Agent Loop for RL (`environments/agent_loop.py`)

```python
class HermesAgentLoop:
    """Runs tool-calling loop using standard OpenAI spec."""
    
    async def run(self, messages: List[Dict]) -> AgentResult:
        """Execute full agent loop."""
        # Returns: messages, turns_used, tool_errors, reasoning_per_turn
```

### 7. Skills System

Skills are procedural memory that the agent can load dynamically:

```
skills/
├── creative/
│   └── excalidraw/
│       ├── SKILL.md        # Injected into system prompt
│       └── scripts/
│           └── upload.py   # Agent can execute this
├── productivity/
│   ├── google-workspace/
│   ├── powerpoint/
│   └── ocr-and-documents/
├── research/
│   ├── arxiv/
│   └── domain-intel/
└── ...
```

**Skill Loading:**
1. Agent calls `skills_list` to see available skills
2. Agent calls `skill_view("skill-name")` to read SKILL.md
3. SKILL.md content is injected into the system prompt
4. Agent can execute scripts from the skill's `scripts/` directory

### 8. Cron Scheduler

```python
# cron/jobs.py

def create_job(
    prompt: str,
    schedule: str,    # "30m", "every 2h", "0 9 * * *", "2026-02-03T14:00"
    deliver: str,     # "telegram", "discord", "local", "origin"
    skills: List[str],
    model: str,
):
    """Create a scheduled job."""
    pass

# cron/scheduler.py

class CronScheduler:
    """Async scheduler that runs due jobs."""
    
    async def run(self):
        """Main loop: check for due jobs, execute, deliver results."""
        pass
```

---

## Data Flow Diagrams

### Message Flow (Gateway)

```
User Message (Telegram/Discord/etc.)
         │
         ▼
┌─────────────────────┐
│ Platform Adapter    │
│ (e.g., telegram.py) │
└─────────────────────┘
         │
         ▼ MessageEvent
┌─────────────────────┐
│ GatewayRunner       │
│ handle_message()    │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ SessionStore        │
│ get_or_create()     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ AIAgent             │
│ run_conversation()  │
└─────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ Tools │ │ LLM   │
│       │ │ API   │
└───────┘ └───────┘
         │
         ▼ Response
┌─────────────────────┐
│ DeliveryRouter      │
│ route_to_platform() │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Platform Adapter    │
│ send()              │
└─────────────────────┘
         │
         ▼
User Receives Response
```

### Tool Execution Flow

```
AIAgent receives tool_call from LLM
         │
         ▼
┌─────────────────────┐
│ model_tools.py      │
│ handle_function_call│
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ tools/registry.py   │
│ dispatch()          │
└─────────────────────┘
         │
         ├──────────────────────────────────────┐
         ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────┐
│ Sync Handler        │              │ Async Handler       │
│ (direct call)       │              │ (_run_async bridge) │
└─────────────────────┘              └─────────────────────┘
         │                                      │
         └──────────────┬───────────────────────┘
                        ▼
              Tool Result (JSON string)
                        │
                        ▼
              Appended to conversation as
              role="tool" message
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `run_agent.py` | Core AIAgent class - conversation orchestration |
| `model_tools.py` | Tool discovery, dispatch, and schema generation |
| `tools/registry.py` | Central tool registration singleton |
| `hermes_state.py` | SQLite session database with FTS5 |
| `gateway/run.py` | GatewayRunner - multi-platform messaging |
| `gateway/platforms/base.py` | BasePlatformAdapter interface |
| `gateway/config.py` | Gateway configuration classes |
| `gateway/session.py` | SessionStore for gateway sessions |
| `cron/jobs.py` | Cron job CRUD and scheduling |
| `cron/scheduler.py` | Async job scheduler |
| `environments/agent_loop.py` | HermesAgentLoop for RL |
| `environments/hermes_base_env.py` | Atropos base environment |
| `hermes_cli/main.py` | CLI entry point |
| `hermes_cli/config.py` | Configuration loading |
| `agent/prompt_builder.py` | System prompt construction |
| `agent/context_compressor.py` | LLM-based context compression |
| `agent/usage_pricing.py` | Cost estimation |
| `honcho_integration/` | Cross-session memory via Honcho |
| `acp_adapter/` | Editor integration protocol |

---

## Configuration Reference

### `~/.hermes/config.yaml` (Main Config)

```yaml
# Model configuration
model:
  default: "anthropic/claude-sonnet-4-20250514"
  fallback: "openai/gpt-4.1-mini"

# Provider settings
provider:
  allowed: ["Anthropic", "OpenAI"]
  ignored: ["DeepInfra"]

# Terminal backend
terminal:
  backend: docker  # local, docker, modal, daytona, ssh, singularity
  cwd: ~/projects
  timeout: 120

# Agent behavior
agent:
  max_turns: 90
  tool_delay: 0.5

# Session reset
session_reset:
  mode: both  # daily, idle, both, none
  at_hour: 4
  idle_minutes: 1440

# Platform configurations
platforms:
  telegram:
    enabled: true
    token: ${TELEGRAM_BOT_TOKEN}
  discord:
    enabled: true
    token: ${DISCORD_BOT_TOKEN}

# Memory
honcho:
  enabled: true
  write_frequency: session
```

---

## Extending Hermes

### Adding a New Tool

```python
# tools/my_tool.py

from tools.registry import registry

def _check_my_tool():
    """Return True if tool is available."""
    return os.getenv("MY_TOOL_API_KEY") is not None

def _my_tool_handler(args: dict, **kwargs) -> str:
    """Execute the tool."""
    # Implementation
    return json.dumps({"result": "success"})

# Schema in OpenAI format
MY_TOOL_SCHEMA = {
    "name": "my_tool",
    "description": "Does something useful",
    "parameters": {
        "type": "object",
        "properties": {
            "input": {"type": "string", "description": "Input value"}
        },
        "required": ["input"]
    }
}

# Register at module import time
registry.register(
    name="my_tool",
    toolset="my_toolset",
    schema=MY_TOOL_SCHEMA,
    handler=_my_tool_handler,
    check_fn=_check_my_tool,
    requires_env=["MY_TOOL_API_KEY"],
)
```

### Adding a New Platform Adapter

```python
# gateway/platforms/myplatform.py

from gateway.platforms.base import BasePlatformAdapter, MessageEvent, SendResult

class MyPlatformAdapter(BasePlatformAdapter):
    async def connect(self) -> bool:
        # Connect to platform
        self._mark_connected()
        return True
    
    async def disconnect(self) -> None:
        self._mark_disconnected()
    
    async def send(
        self, chat_id: str, content: str, 
        reply_to: str = None, metadata: dict = None
    ) -> SendResult:
        # Send message
        return SendResult(success=True, message_id="...")
```

---

This architecture enables Hermes to be:
- **Modular**: Each component can be developed/tested independently
- **Extensible**: Easy to add tools, platforms, skills
- **Scalable**: From local CLI to multi-platform gateway to RL training
- **Research-ready**: Full Atropos integration for training tool-calling models
