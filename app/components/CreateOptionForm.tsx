import { useState } from "react"
import { ethers } from "ethers"
import { ContractManager } from "~/utils/contracts"
import type { CreateOptionParams } from "~/types/contracts"

interface CreateOptionFormProps {
  onSuccess: (optionId: bigint) => void
}

export function CreateOptionForm({ onSuccess }: CreateOptionFormProps) {
  const [formData, setFormData] = useState<CreateOptionParams>({
    bank: "",
    strikePrice: 0n,
    premium: 0n,
    expiryDate: 0n,
    quantity: 0n,
    cropType: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handle Submit")
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const contractManager = new ContractManager()
      await contractManager.connect()
      const optionId = await contractManager.createOption(formData)
      onSuccess(optionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Bank Address:</label>
        <input
          type="text"
          value={formData.bank}
          onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
        />
      </div>
      <div>
        <label>Strike Price (USDC):</label>
        <input
          type="number"
          value={Number(formData.strikePrice)}
          onChange={(e) =>
            setFormData({ ...formData, strikePrice: BigInt(e.target.value) })
          }
        />
      </div>
      <div>
        <label>Premium (USDC):</label>
        <input
          type="number"
          value={Number(formData.premium)}
          onChange={(e) =>
            setFormData({ ...formData, premium: BigInt(e.target.value) })
          }
        />
      </div>
      <div>
        <label>Expiry Date:</label>
        <input
          type="date"
          onChange={(e) =>
            setFormData({
              ...formData,
              expiryDate: BigInt(new Date(e.target.value).getTime() / 1000),
            })
          }
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={Number(formData.quantity)}
          onChange={(e) =>
            setFormData({ ...formData, quantity: BigInt(e.target.value) })
          }
        />
      </div>
      <div>
        <label>Crop Type:</label>
        <input
          type="text"
          value={formData.cropType}
          onChange={(e) =>
            setFormData({ ...formData, cropType: e.target.value })
          }
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Option"}
      </button>
      {error && <div className="error">{error}</div>}
      {formData.bank && (
        <div className="listing-details">
          <h3>Listing Details</h3>
          <p>Bank: {formData.bank}</p>
          <p>Strike Price: {Number(formData.strikePrice)} USDC</p>
          <p>Premium: {Number(formData.premium)} USDC</p>
          <p>Quantity: {Number(formData.quantity)}</p>
          <p>Crop Type: {formData.cropType}</p>
        </div>
      )}
    </form>
  )
}
