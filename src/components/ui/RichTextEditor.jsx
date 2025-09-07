import React, { useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const RichTextEditor = ({ value, onChange, className }) => {
  const quillRef = useRef(null)

  const handleChange = (html, delta, source, editor) => {
    const content = {
      html,
      delta: editor.getContents()
    }
    if (onChange) onChange(content)
  }

  return (
    <ReactQuill
      ref={quillRef}
      value={value?.html || ''}
      onChange={handleChange}
      className={className}
      theme="snow"
    />
  )
}

export default RichTextEditor
