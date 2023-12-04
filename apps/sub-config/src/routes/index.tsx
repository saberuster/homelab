import { $, component$, useStylesScoped$ } from "@builder.io/qwik"
import { routeLoader$, type DocumentHead, z } from "@builder.io/qwik-city"
import {
  type InitialValues,
  useForm,
  valiForm$,
  getValues,
  formAction$,
} from "@modular-forms/qwik"
import { TextInput } from "@homelab/form"
import { prisma } from "../prisma-client"
import styles from "./app.css?inline"

const commonErrorMsg = (field_name: string, type_str: string = "string") => ({
  required_error: `${field_name} 不能为空`,
  invalid_error: `${field_name} 必须为 ${type_str}`,
})

const urlFormatErrorMsg = { message: "Invalid URL format" }

const SubConfigSchema = z.object({
  backend: z
    .string(commonErrorMsg("subconverter"))
    .trim()
    .url(urlFormatErrorMsg), // subconverter 后端地址
  subs: z.string(commonErrorMsg("订阅链接")).trim(), // 订阅链接 一行表示一个订阅
  config: z.string(commonErrorMsg("规则地址")).trim().url(urlFormatErrorMsg), // 规则配置地址
})

type SubConfigForm = z.infer<typeof SubConfigSchema>

export const useSubConfigLoader = routeLoader$<InitialValues<SubConfigForm>>(
  async () => {
    const sub_config = await prisma.subConfig.findFirst()
    return {
      backend: sub_config?.backend || "",
      subs: sub_config?.subs || "",
      config: sub_config?.config || "",
    }
  },
)

export const useSaveSubConfig = formAction$<SubConfigForm>(
  async ({ backend, subs, config }) => {
    await prisma.subConfig.upsert({
      where: { id: 1 },
      create: {
        profile: "default",
        backend,
        subs,
        config,
      },
      update: {
        backend,
        subs,
        config,
      },
    })
  },
  valiForm$(SubConfigSchema),
)

export default component$(() => {
  console.log(styles)
  useStylesScoped$(styles)
  const [configForm, { Form, Field }] = useForm<SubConfigForm>({
    loader: useSubConfigLoader(),
    action: useSaveSubConfig(),
    validate: valiForm$(SubConfigSchema),
    validateOn: "input",
  })

  const genUrl = $(() => {
    const { backend, subs, config } = getValues(configForm, {
      shouldValid: true,
    })
    const sub_info = subs
      ?.split("\n")
      .filter((url) => url)
      .map((url) => encodeURIComponent(url))
      .join("|")

    const config_info = config && encodeURIComponent(config)
    const result_url = `${backend}/sub?target=clash&config=${config_info}&url=${sub_info}`
    // copy result_url to clipboard
    navigator.clipboard.writeText(result_url)
  })

  return (
    <div class="formcontainer mx-auto max-w-2xl px-6 text-gray-900 antialiased">
      <h1 class="my-3 text-center">Clash 订阅链接生成器</h1>
      <Form>
        <Field name="backend">
          {(field, props) => (
            <TextInput
              {...props}
              name="backend"
              label="subconverter 后端地址"
              type="url"
              placeholder="http://192.168.2.4:25500"
              value={field.value}
              error={field.error}
              required
            />
          )}
        </Field>
        <Field name="config">
          {(field, props) => (
            <TextInput
              {...props}
              name="config"
              label="规则配置地址"
              type="url"
              value={field.value}
              error={field.error}
              required
            />
          )}
        </Field>
        <Field name="subs" type="string">
          {(field, props) => (
            <div>
              <label for="subs">订阅链接</label>
              <textarea
                id="subs"
                class="w-full"
                rows={20}
                {...props}
                value={field.value}
              />
            </div>
          )}
        </Field>
        <button
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="button"
          onClick$={genUrl}
        >
          生成链接
        </button>
        <button class="focus-visible:bg-yello-200 flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          保存
        </button>
      </Form>
    </div>
  )
})

export const head: DocumentHead = {
  title: "clash sub config editor",
  meta: [
    {
      name: "description",
      content: "save&edit your clash sub config",
    },
  ],
}
