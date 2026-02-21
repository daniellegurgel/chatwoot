import { useAdmin } from 'dashboard/composables/useAdmin';

export const APP_NAME = 'Neurotrading Chat';

/**
 * Composable para controle de visibilidade do sidebar via config do servidor.
 * Le window.neurotradingConfig (injetado pelo Rails via config/neurotrading_sidebar.json).
 * Admins sempre veem tudo. Agentes veem apenas o que esta na allowlist.
 * Se nao houver config, mostra tudo (fallback seguro).
 */
export function useNeurotradingConfig() {
  const { isAdmin } = useAdmin();
  const config = window.neurotradingConfig || {};
  const sidebarVisibility = config.sidebar_visibility || {};
  const conversationVisibility = config.conversation_visibility || {};

  const isItemVisibleForRole = itemName => {
    if (isAdmin.value) return true;

    const agentConfig = sidebarVisibility.agent;
    if (!agentConfig || !agentConfig.visible_items) return true;

    if (itemName === 'Settings') {
      const hasVisibleChildren =
        Array.isArray(agentConfig.visible_settings_children) &&
        agentConfig.visible_settings_children.length > 0;
      return (
        agentConfig.visible_items.includes('Settings') || hasVisibleChildren
      );
    }

    return agentConfig.visible_items.includes(itemName);
  };

  const isSettingsChildVisibleForRole = childName => {
    if (isAdmin.value) return true;

    const agentConfig = sidebarVisibility.agent;
    if (!agentConfig || !agentConfig.visible_settings_children) return true;

    return agentConfig.visible_settings_children.includes(childName);
  };

  const isTabVisibleForRole = tabKey => {
    if (isAdmin.value) return true;

    const agentConfig = conversationVisibility.agent;
    if (!agentConfig || !agentConfig.visible_tabs) return true;

    return agentConfig.visible_tabs.includes(tabKey);
  };

  return {
    isItemVisibleForRole,
    isSettingsChildVisibleForRole,
    isTabVisibleForRole,
  };
}
