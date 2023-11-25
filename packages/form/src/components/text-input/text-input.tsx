import {
  type PropFunction,
  type QwikChangeEvent,
  type QwikFocusEvent,
  component$,
} from "@builder.io/qwik"

type TextInputProps = {
  name: string
  type: "text" | "email" | "password" | "url" | "date"
  label?: string
  value: string | undefined
  error: string
  placeholder?: string
  required?: boolean
  ref: PropFunction<(element: Element) => void>
  onInput$: PropFunction<(event: Event, element: HTMLInputElement) => void>
  onChange$: PropFunction<
    (
      event: QwikChangeEvent<HTMLInputElement>,
      element: HTMLInputElement,
    ) => void
  >
  onBlur$: PropFunction<
    (event: QwikFocusEvent<HTMLInputElement>, element: HTMLInputElement) => void
  >
}

export const TextInput = component$(
  ({ name, label, error, required, ...props }: TextInputProps) => {
    return (
      <div>
        {label && (
          <label for={name}>
            {label} {required && <span>*</span>}
          </label>
        )}
        <input
          {...props}
          id={name}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        {error && <div id={`${name}-error`}>{error}</div>}
      </div>
    )
  },
)
