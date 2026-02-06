<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

type StatusEntry = {
  code: number
  label: string
  group: string
}

const query = ref('')

const statuses: StatusEntry[] = [
  { code: 100, label: 'Continue', group: 'informational' },
  { code: 101, label: 'Switching Protocols', group: 'informational' },
  { code: 102, label: 'Processing', group: 'informational' },
  { code: 103, label: 'Early Hints', group: 'informational' },
  { code: 200, label: 'OK', group: 'success' },
  { code: 201, label: 'Created', group: 'success' },
  { code: 202, label: 'Accepted', group: 'success' },
  { code: 203, label: 'Non-Authoritative Information', group: 'success' },
  { code: 204, label: 'No Content', group: 'success' },
  { code: 205, label: 'Reset Content', group: 'success' },
  { code: 206, label: 'Partial Content', group: 'success' },
  { code: 207, label: 'Multi-Status', group: 'success' },
  { code: 208, label: 'Already Reported', group: 'success' },
  { code: 226, label: 'IM Used', group: 'success' },
  { code: 300, label: 'Multiple Choices', group: 'redirection' },
  { code: 301, label: 'Moved Permanently', group: 'redirection' },
  { code: 302, label: 'Found', group: 'redirection' },
  { code: 303, label: 'See Other', group: 'redirection' },
  { code: 304, label: 'Not Modified', group: 'redirection' },
  { code: 305, label: 'Use Proxy', group: 'redirection' },
  { code: 307, label: 'Temporary Redirect', group: 'redirection' },
  { code: 308, label: 'Permanent Redirect', group: 'redirection' },
  { code: 400, label: 'Bad Request', group: 'client error' },
  { code: 401, label: 'Unauthorized', group: 'client error' },
  { code: 402, label: 'Payment Required', group: 'client error' },
  { code: 403, label: 'Forbidden', group: 'client error' },
  { code: 404, label: 'Not Found', group: 'client error' },
  { code: 405, label: 'Method Not Allowed', group: 'client error' },
  { code: 406, label: 'Not Acceptable', group: 'client error' },
  { code: 407, label: 'Proxy Authentication Required', group: 'client error' },
  { code: 408, label: 'Request Timeout', group: 'client error' },
  { code: 409, label: 'Conflict', group: 'client error' },
  { code: 410, label: 'Gone', group: 'client error' },
  { code: 411, label: 'Length Required', group: 'client error' },
  { code: 412, label: 'Precondition Failed', group: 'client error' },
  { code: 413, label: 'Content Too Large', group: 'client error' },
  { code: 414, label: 'URI Too Long', group: 'client error' },
  { code: 415, label: 'Unsupported Media Type', group: 'client error' },
  { code: 416, label: 'Range Not Satisfiable', group: 'client error' },
  { code: 417, label: 'Expectation Failed', group: 'client error' },
  { code: 418, label: "I'm a teapot", group: 'client error' },
  { code: 421, label: 'Misdirected Request', group: 'client error' },
  { code: 422, label: 'Unprocessable Content', group: 'client error' },
  { code: 423, label: 'Locked', group: 'client error' },
  { code: 424, label: 'Failed Dependency', group: 'client error' },
  { code: 425, label: 'Too Early', group: 'client error' },
  { code: 426, label: 'Upgrade Required', group: 'client error' },
  { code: 428, label: 'Precondition Required', group: 'client error' },
  { code: 429, label: 'Too Many Requests', group: 'client error' },
  { code: 431, label: 'Request Header Fields Too Large', group: 'client error' },
  { code: 451, label: 'Unavailable For Legal Reasons', group: 'client error' },
  { code: 500, label: 'Internal Server Error', group: 'server error' },
  { code: 501, label: 'Not Implemented', group: 'server error' },
  { code: 502, label: 'Bad Gateway', group: 'server error' },
  { code: 503, label: 'Service Unavailable', group: 'server error' },
  { code: 504, label: 'Gateway Timeout', group: 'server error' },
  { code: 505, label: 'HTTP Version Not Supported', group: 'server error' },
  { code: 506, label: 'Variant Also Negotiates', group: 'server error' },
  { code: 507, label: 'Insufficient Storage', group: 'server error' },
  { code: 508, label: 'Loop Detected', group: 'server error' },
  { code: 510, label: 'Not Extended', group: 'server error' },
  { code: 511, label: 'Network Authentication Required', group: 'server error' },
]

const filteredStatuses = computed(() => {
  const value = query.value.trim().toLowerCase()
  if (!value) {
    return statuses
  }

  return statuses.filter((status) => {
    return (
      status.code.toString().includes(value) ||
      status.label.toLowerCase().includes(value) ||
      status.group.includes(value)
    )
  })
})
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-4xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">http status code lookup</h1>

      <div class="flex flex-col gap-2">
        <label class="text-xs text-neutral-400" for="status-query">filter</label>
        <input
          id="status-query"
          v-model="query"
          class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          placeholder="code, label, or group"
        />
      </div>

      <div class="grid gap-2 text-sm">
        <div
          v-for="status in filteredStatuses"
          :key="status.code"
          class="flex items-center justify-between rounded-xl bg-neutral-900 px-3 py-2"
          data-testid="status-row"
        >
          <div class="flex items-center gap-3">
            <span class="text-neutral-100">{{ status.code }}</span>
            <span class="text-neutral-300">{{ status.label }}</span>
          </div>
          <span class="text-xs text-neutral-500">{{ status.group }}</span>
        </div>
      </div>
    </section>
  </main>
</template>
