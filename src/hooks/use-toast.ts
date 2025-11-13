import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

/**
 * Maximum number of toasts to display at once.
 */
const TOAST_LIMIT = 1
/**
 * Delay before a toast is removed from the DOM after being dismissed.
 * This value is intentionally very large (1,000,000ms) to keep toasts visible
 * until explicitly interacted with or replaced by a new toast.
 */
const TOAST_REMOVE_DELAY = 1000000

/**
 * Extended ToastProps to include an ID and optional ReactNode for title/description.
 * @interface ToasterToast
 * @extends ToastProps
 * @property {string} id - Unique identifier for the toast.
 * @property {React.ReactNode} [title] - Optional title content for the toast.
 * @property {React.ReactNode} [description] - Optional description content for the toast.
 * @property {ToastActionElement} [action] - Optional action button for the toast.
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * Defines the types of actions that can be dispatched to the toast reducer.
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

/**
 * Generates a unique ID for each toast.
 * @returns {string} A unique string ID.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

/**
 * Defines the possible actions that can be dispatched to the toast reducer.
 * @typedef {object} Action
 * @property {'ADD_TOAST'} type - Action to add a new toast.
 * @property {ToasterToast} toast - The toast object to add.
 *
 * @property {'UPDATE_TOAST'} type - Action to update an existing toast.
 * @property {Partial<ToasterToast>} toast - Partial toast object with updates.
 *
 * @property {'DISMISS_TOAST'} type - Action to dismiss a toast (starts removal timer).
 * @property {string} [toastId] - Optional ID of the toast to dismiss. If undefined, dismisses all.
 *
 * @property {'REMOVE_TOAST'} type - Action to remove a toast from the state (after dismissal timer).
 * @property {string} [toastId] - Optional ID of the toast to remove. If undefined, removes all.
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

/**
 * Interface for the state managed by the toast reducer.
 * @interface State
 * @property {ToasterToast[]} toasts - An array of active toasts.
 */
interface State {
  toasts: ToasterToast[]
}

/**
 * A map to store timeouts for toast removal, keyed by toast ID.
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Adds a toast to the removal queue, setting a timeout for its removal.
 * @param {string} toastId - The ID of the toast to add to the queue.
 * @returns {void}
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * The reducer function for managing toast state.
 * It handles adding, updating, dismissing, and removing toasts.
 * @param {State} state - The current state of toasts.
 * @param {Action} action - The action to be performed.
 * @returns {State} The new state of toasts.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add new toast to the beginning and limit the total number of toasts.
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        // Update properties of an existing toast by its ID.
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Side effects: Add toast(s) to the removal queue.
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        // Mark toast(s) as 'open: false' to trigger exit animations.
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      // Remove toast(s) completely from the state.
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [], // Remove all toasts
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId), // Remove specific toast
      }
  }
}

/**
 * Array of listener functions that are called whenever the toast state changes.
 */
const listeners: Array<(state: State) => void> = []

/**
 * Global in-memory state for toasts, managed by the reducer.
 */
let memoryState: State = { toasts: [] }

/**
 * Dispatches an action to the toast reducer and notifies all listeners of the state change.
 * @param {Action} action - The action to dispatch.
 * @returns {void}
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * Type for creating a new toast, omitting the 'id' property as it's generated internally.
 */
type Toast = Omit<ToasterToast, "id">

/**
 * Function to create and display a new toast notification.
 * @param {Toast} props - Properties for the new toast.
 * @returns {object} An object with the toast's ID, and functions to dismiss or update it.
 */
function toast({ ...props }: Toast) {
  const id = genId() // Generate a unique ID for the new toast.

  /**
   * Updates an existing toast.
   * @param {ToasterToast} props - Properties to update the toast with.
   * @returns {void}
   */
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  /**
   * Dismisses the toast.
   * @returns {void}
   */
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Dispatch action to add the new toast.
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Ensure toast is initially open.
      onOpenChange: (open) => {
        if (!open) dismiss() // Dismiss toast if its open state changes to false.
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Custom React hook to access and manage toast notifications.
 * It subscribes to global toast state changes and provides functions to interact with toasts.
 * @returns {object} An object containing the current toast state, and functions to create or dismiss toasts.
 */
function useToast() {
  // Local state to reflect the global toast state.
  const [state, setState] = React.useState<State>(memoryState)

  // Effect to subscribe and unsubscribe to global state changes.
  React.useEffect(() => {
    listeners.push(setState) // Add local setState to global listeners.
    return () => {
      // Cleanup: remove local setState from listeners on unmount.
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state]) // Dependency on state to ensure listeners are correctly managed.

  return {
    ...state,
    toast, // Expose the toast creation function.
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }), // Expose dismiss function.
  }
}

export { useToast, toast }
