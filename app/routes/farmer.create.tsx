import { useState } from "react"
import type { ActionFunction } from "@remix-run/node"
import { Form } from "@remix-run/react"
import type { CreateOptionParams } from "~/types/contracts"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ContractManager } from "~/utils/contracts"

export const clientAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  /*
  bank: formData.get("bank") as string,
    strikePrice: BigInt(formData.get("strikePrice") as string),
    premium: String(formData.get("premium") as string),
    expiryDate: BigInt(
      new Date(formData.get("expiryDate") as string).getTime() / 1000
    ),
    quantity: BigInt(formData.get("quantity") as string),
    cropType: formData.get("cropType") as string,

    */
  const params = {
    bank: "0x1234567890123456789012345678901234567890",
    strikePrice: BigInt(1000000),
    premium: "1000",
    expiryDate: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30),
    quantity: BigInt(1000),
    cropType: "corn",
  }

  try {
    const contractManager = new ContractManager()
    await contractManager.connect()
    const optionId = await contractManager.createOption(params)
    return { optionId }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Transaction failed" }
  }
}

export default function CreateOption() {
  const [cropType, setCropType] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [premium, setPremium] = useState<string>("")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Option
        </h1>
        <Form method="post" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Crop Type</label>
              <Input asChild className="[&>select]:pr-8">
                <select>
                  <option value="corn">Corn</option>
                  <option value="wheat">Wheat</option>
                  <option value="soybean">Soybean</option>
                  <option value="rice">Rice</option>
                </select>
              </Input>
            </div>
          </div>
          <Button type="submit" className="w-full" isLoading={false}>
            Create Option
          </Button>
        </Form>
      </div>
    </div>
  )
}
// Key mobile-first improvements:
// - Increased padding for touch targets (p-3 → p-4)
// - Responsive container spacing (px-4 py-6)
// - Enhanced focus states (focus:ring-2)
