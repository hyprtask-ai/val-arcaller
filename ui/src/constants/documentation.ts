import { DOCS_URL, docsUrl } from "@/lib/brand";

/** Empty when NEXT_PUBLIC_DOCS_URL is unset (Val OSS); doc links resolve to `#`. */
export const DOCS_BASE = DOCS_URL.replace(/\/$/, "");

function doc(path: string): string {
  return docsUrl(path);
}

export const NODE_DOCUMENTATION_URLS: Record<string, string> = {
  startCall: doc("voice-agent/start-call"),
  endCall: doc("voice-agent/end-call"),
  agent: doc("voice-agent/agent"),
  global: doc("voice-agent/global"),
  apiTrigger: doc("voice-agent/api-trigger"),
  webhook: doc("voice-agent/webhook"),
  qaAnalysis: doc("getting-started"),
};

export const CONTEXT_VARIABLES_DOC_URL = doc("core-concepts/context-and-variables");

export const TOOLS_INTRODUCTION_DOC_URL = doc("voice-agent/tools/introduction");

export const KNOWLEDGE_BASE_DOC_URL = doc("voice-agent/knowledge-base");

export const PRE_CALL_DATA_FETCH_DOC_URL = doc("voice-agent/pre-call-data-fetch");

export const SETTINGS_DOCUMENTATION_URLS: Record<string, string> = {
  general: doc("voice-agent/editing-a-workflow"),
  modelOverrides: doc("configurations/inference-providers"),
  templateVariables: doc("voice-agent/template-variables"),
  recordings: doc("voice-agent/pre-recorded-audio"),
  deployment: doc("voice-agent/add-to-website"),
};

export const WIDGET_CONTEXT_DOC_URL = doc("voice-agent/add-to-website#pass-context-to-the-agent");

export const WIDGET_MODE_DOCUMENTATION_URLS: Record<"floating" | "inline" | "headless", string> = {
  floating: doc("voice-agent/add-to-website#floating-widget"),
  inline: doc("voice-agent/add-to-website#inline-component"),
  headless: doc("voice-agent/add-to-website#headless-mode"),
};

export const TOOL_DOCUMENTATION_URLS: Record<string, string> = {
  http_api: doc("voice-agent/tools/http-api"),
  end_call: doc("voice-agent/tools/end-call"),
  transfer_call: doc("voice-agent/tools/call-transfer"),
};

export const INTERRUPTION_DOC_URL = doc("configurations/interruption");

export const API_KEYS_DOC_URL = doc("configurations/api-keys#service-keys");

export const TELEPHONY_OVERVIEW_DOC_URL = doc("integrations/telephony/overview");

export const TELEPHONY_INBOUND_DOC_URL = doc("integrations/telephony/inbound");
