import React, { useState, useRef } from 'react'
import Button from './Button'
import Loader from './Loader'
import { uploadMedia } from '../../lib/supabase'

const ImageUploader = ({ onUpload, folder, label = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadMedia(file, { folder })
      setPreview(result?.url)
      if (onUpload) onUpload(result)
    } catch (err) {
      console.error('Image upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <img src={preview} alt="preview" className="h-32 w-32 object-cover rounded" />
      )}
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader size="sm" /> : label}
      </Button>
    </div>
  )
}

export default ImageUploader
