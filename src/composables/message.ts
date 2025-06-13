import type { FunctionalComponent, VNode } from 'vue'
import { isString } from '@vue/shared'
import { render, TransitionGroup } from 'vue'

export const messageTypes = ['primary', 'success', 'info', 'warning', 'error'] as const
let messageSeed = 0

type MessageType = (typeof messageTypes)[number]
interface MessageProps {
  message: string
  type: MessageType
  onClose?: () => void
  onDestroy?: () => void
}

type MessageParams = MessageProps | MessageProps['message']

interface MessageHandler {
  close: () => void
}

interface MessageContext {
  id: string
  vnode: VNode
  props: MessageProps
  handler: MessageHandler
}

interface MessageFn {
  (options: MessageParams): MessageHandler
  closeAll: (type?: MessageType) => void
}

type Message = MessageFn & {
  [K in MessageType]: (options: MessageProps['message']) => MessageHandler
}

const instances = ref<MessageContext[]>([])

const MessageComponent: FunctionalComponent<MessageProps> = (props) => {
  setTimeout(() => {
    props.onClose?.()
  }, 3000)
  return h('div', {
    class: 'bd rd bg-stone:20 shadow backdrop-blur-8',
    style: {
      'display': 'flex',
      'align-items': 'center',
      'padding': '0.5rem',
      'word-break': 'break-all',
      'overflow-wrap': 'break-word',
      'max-width': '20rem',
    },
  }, [
    h('div', { class: `i-message:${props.type} shrink-0` }),
    h('div', { class: 'ml-2' }, props.message),
  ])
}

const MessageContainer = defineComponent({
  setup: () => {
    return () => h(TransitionGroup, {
      name: 'message',
      tag: 'div',
      style: {
        'display': 'flex',
        'flex-direction': 'column',
        'gap': '0.5rem',
        'position': 'fixed',
        'top': '1rem',
        'right': '1rem',
        'z-index': '100',
        'padding': '1rem',
      },
    }, () => instances.value.map((instance) => {
      return h(MessageComponent, {
        ...instance.props,
        key: instance.id,
      })
    }))
  },
})

function closeMessage(instance: MessageContext) {
  const idx = instances.value.indexOf(instance)
  if (idx === -1)
    return

  instances.value.splice(idx, 1)
  const { handler } = instance
  handler.close()
}

function createMessage(_options: MessageParams): MessageContext {
  const id = `message-${messageSeed++}`

  const container = document.createElement('div')
  let instance: MessageContext
  const props = {
    ...(isString(_options)
      ? { message: _options, type: 'info' as const }
      : _options),
    onClose: () => {
      closeMessage(instance)
    },
    onDestroy: () => {
      render(null, container)
      container.remove()
    },
  }
  const vnode = h(
    MessageComponent,
    props,
    () => props.message,
  )
  render(vnode, container)
  const handler: MessageHandler = {
    close: () => {
      vnode.component!.exposed!.close()
    },
  }

  instance = { id, props, vnode, handler }

  return instance
}

const message: MessageFn & Partial<Message> = (
  options: MessageParams,
) => {
  const instance = createMessage(options)
  instances.value.push(instance)
  return instance.handler
}

messageTypes.forEach((type) => {
  message[type] = (msg: MessageProps['message']) => {
    return message({
      message: msg,
      type,
    })
  }
})

let isMounted = false

message.closeAll = (type?: MessageType) => {
  if (!isMounted)
    return

  render(null, document.getElementById('message-container')!)
  isMounted = false

  instances.value.forEach((instance) => {
    const props = instance.vnode.component!.props
    if (!type || props.type === type) {
      instance.handler.close()
    }
  })
}

export function useMessage() {
  if (!isMounted) {
    const container = document.createElement('div')
    container.id = 'message-container'
    const vnode = h(MessageContainer)
    vnode.appContext = getCurrentInstance()?.appContext || null
    render(vnode, container)
    document.body.appendChild(container.firstChild!)
    isMounted = true
  }
  return message as Message
}
