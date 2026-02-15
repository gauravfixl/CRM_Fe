import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Integration {
    id: string;
    name: string;
    provider: 'Slack' | 'WhatsApp' | 'Google' | 'Zoom' | 'Microsoft';
    category: 'Communication' | 'Calendar' | 'Meeting' | 'Storage';
    isConnected: boolean;
    config: {
        apiKey?: string;
        webhookUrl?: string;
        channelId?: string;
        clientId?: string;
    };
    lastSync?: string;
}

export interface Webhook {
    id: string;
    url: string;
    events: string[]; // e.g., 'leave.approved', 'employee.onboarded'
    isActive: boolean;
    secret: string;
}

interface IntegrationsState {
    integrations: Integration[];
    webhooks: Webhook[];
    apiKeys: { id: string; name: string; key: string; lastUsed?: string }[];

    // Integration Actions
    addIntegration: (integration: Omit<Integration, 'id'>) => void;
    toggleIntegration: (id: string, isConnected: boolean) => void;
    updateIntegrationConfig: (id: string, config: any) => void;

    // Webhook Actions
    addWebhook: (webhook: Omit<Webhook, 'id' | 'secret'>) => void;
    deleteWebhook: (id: string) => void;

    // API Key Actions
    generateApiKey: (name: string) => void;
    revokeApiKey: (id: string) => void;
}

const INITIAL_INTEGRATIONS: Integration[] = [
    {
        id: 'int-1',
        name: 'Slack Notifications',
        provider: 'Slack',
        category: 'Communication',
        isConnected: false,
        config: {}
    },
    {
        id: 'int-2',
        name: 'WhatsApp Business',
        provider: 'WhatsApp',
        category: 'Communication',
        isConnected: true,
        config: { apiKey: '*********' },
        lastSync: '2026-01-20T10:00:00Z'
    },
    {
        id: 'int-3',
        name: 'Google Calendar',
        provider: 'Google',
        category: 'Calendar',
        isConnected: true,
        config: {},
        lastSync: '2026-01-20T12:30:00Z'
    },
    {
        id: 'int-4',
        name: 'Zoom Meetings',
        provider: 'Zoom',
        category: 'Meeting',
        isConnected: false,
        config: {}
    }
];

export const useIntegrationsStore = create<IntegrationsState>()(
    persist(
        (set) => ({
            integrations: INITIAL_INTEGRATIONS,
            webhooks: [],
            apiKeys: [],

            addIntegration: (integration) => set((state) => ({
                integrations: [...state.integrations, { ...integration, id: `int-${Date.now()}` }]
            })),

            toggleIntegration: (id, isConnected) => set((state) => ({
                integrations: state.integrations.map(i => i.id === id ? { ...i, isConnected } : i)
            })),

            updateIntegrationConfig: (id, config) => set((state) => ({
                integrations: state.integrations.map(i => i.id === id ? { ...i, config: { ...i.config, ...config } } : i)
            })),

            addWebhook: (webhook) => set((state) => ({
                webhooks: [...state.webhooks, { ...webhook, id: `wh-${Date.now()}`, secret: `sec_${Date.now()}` }]
            })),

            deleteWebhook: (id) => set((state) => ({
                webhooks: state.webhooks.filter(w => w.id !== id)
            })),

            generateApiKey: (name) => set((state) => ({
                apiKeys: [...state.apiKeys, { id: `key-${Date.now()}`, name, key: `pk_live_${Math.random().toString(36).substr(2, 9)}` }]
            })),

            revokeApiKey: (id) => set((state) => ({
                apiKeys: state.apiKeys.filter(k => k.id !== id)
            }))
        }),
        { name: 'integrations-storage' }
    )
);
