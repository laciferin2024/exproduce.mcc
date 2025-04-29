import { useState } from "react"
import { Form } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useContract } from "src/hooks/useContract"
import { useAccount } from "wagmi"

export default function CreateOption() {
  const { address } = useAccount()
  const { optionsContract } = useContract()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!optionsContract || !address) {
      setError("Please connect your wallet")
      return
    }

    const formData = new FormData(e.currentTarget)
    const params = {
      bank: formData.get("bank") as string,
      strikePrice: BigInt(formData.get("strikePrice") as string),
      premium: BigInt(formData.get("premium") as string),
      expiryDate: BigInt(
        Math.floor(
          new Date(formData.get("expiryDate") as string).getTime() / 1000
        )
      ),
      quantity: BigInt(formData.get("quantity") as string),
      cropType: formData.get("cropType") as string,
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Execute the contract write function
      const txHash = await optionsContract.write.createOption([
        params.bank,
        params.strikePrice,
        params.premium,
        params.expiryDate,
        params.quantity,
        params.cropType,
      ])

      setSuccess(`Option created successfully! Transaction hash: ${txHash}`)
    } catch (err) {
      console.error("Transaction failed:", err)
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Option
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Address</label>
              <Input
                name="bank"
                required
                placeholder="0x..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Strike Price (USD per unit)
              </label>
              <Input
                name="strikePrice"
                type="number"
                required
                step="0.01"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Premium (USD)</label>
              <Input
                name="premium"
                type="number"
                required
                step="0.01"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                name="expiryDate"
                type="date"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity (units)</label>
              <Input
                name="quantity"
                type="number"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Crop Type</label>
              <Input asChild className="[&>select]:pr-8">
                <select name="cropType" required>
                  <option value="corn">Corn</option>
                  <option value="wheat">Wheat</option>
                  <option value="soybean">Soybean</option>
                  <option value="rice">Rice</option>
                </select>
              </Input>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!optionsContract || !address}
          >
            {address ? "Create Option" : "Connect Wallet First"}
          </Button>
        </form>
      </div>
    </div>
  )
}
