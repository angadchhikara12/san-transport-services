<script lang="ts">
	import { Bell, X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		open: boolean;
		onClose: () => void;
		notifications?: { id: string; title: string; message: string; time: string; read: boolean }[];
	}

	let { open, onClose, notifications = [] }: Props = $props();

	const unreadCount = $derived(notifications.filter((n) => !n.read).length);
</script>

{#if open}
	<div class="fixed inset-0 z-[998] bg-black/60" transition:fade={{ duration: 250 }} onclick={onClose} />
	<aside
		class="fixed top-0 right-0 z-[999] w-96 max-w-[calc(100vw-2rem)] h-screen text-white p-0 flex flex-col bg-gradient-to-b from-[#241F12] via-[#15130C] to-[#0D0D0D] border-l border-[#DDBA5E]/30 shadow-[-20px_0_60px_rgba(0,0,0,0.6),10px_0_40px_rgba(221,186,94,0.15)]"
		transition:fly={{ x: 420, duration: 350, easing: cubicOut }}
		role="dialog"
		aria-label="Notifications"
	>
		<div class="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--gold-light)] via-[var(--gold-accent)] to-[var(--gold-dark)] pointer-events-none" />
		<header class="relative flex items-center justify-between p-4 bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold-light)] to-[var(--gold-accent)] text-[#0D0D0D] shrink-0">
			<div class="flex items-center gap-2">
				<h2 class="font-sans text-lg font-semibold">Notifications</h2>
				{#if unreadCount > 0}
					<span class="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#0D0D0D] text-[var(--gold-light)] text-xs font-bold">
						{unreadCount}
					</span>
				{/if}
			</div>
			<button
				type="button"
				class="p-1.5 rounded-md text-[#0D0D0D]/70 hover:text-[#0D0D0D] hover:bg-white/30 transition-colors cursor-pointer"
				onclick={onClose}
				aria-label="Close"
			>
				<X class="w-5 h-5" />
			</button>
		</header>

		<div class="flex-1 overflow-y-auto">
			{#if notifications.length === 0}
				<div class="flex flex-col items-center justify-center h-64 text-gray-400">
					<Bell class="w-10 h-10 mb-3 opacity-40" />
					<p class="font-sans text-sm">No notifications yet</p>
				</div>
			{:else}
				<ul class="divide-y divide-[#DDBA5E]/10">
					{#each notifications as notification (notification.id)}
						<li
							class="p-4 transition-colors hover:bg-white/5 cursor-pointer {notification.read ? '' : 'bg-gradient-to-r from-[rgba(221,186,94,0.12)] to-transparent'}"
						>
							<div class="flex items-start justify-between gap-2">
								<h3 class="font-sans text-sm font-medium {notification.read ? 'text-gray-300' : 'text-[var(--gold-light)]'}">
									{notification.title}
								</h3>
								{#if !notification.read}
									<span class="mt-1 size-2 shrink-0 rounded-full bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)]" />
								{/if}
							</div>
							<p class="mt-1 text-xs text-gray-400 font-sans line-clamp-2">{notification.message}</p>
							<span class="mt-2 block text-[11px] text-gray-500 font-sans">{notification.time}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>
{/if}