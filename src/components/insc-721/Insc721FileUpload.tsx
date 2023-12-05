import { useDropzone } from 'react-dropzone'
import { Typography, SvgIcon } from '@mui/material'
import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { FileInfo } from '~/components/common/FileUpload'
import FileUpload from '~/components/common/FileUpload'
import InfoIcon from '~/public/images/info.svg'

const AcceptedMimeTypes = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/gif': ['.gif'],
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  // 'video/mp4': ['.mp4'],
  // 'video/webm': ['.webm'],
  // 'audio/wav': ['.wav'],
  // 'audio/mpeg': ['.mp3'],
  // 'text/html': ['.html'],
  'application/json': ['.json'],
}

export const Insc721FileUpload = ({
  setFile,
  fileInfo,
}: {
  setFile: Dispatch<SetStateAction<File | undefined>>
  fileInfo?: FileInfo
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return
      }
      const file = acceptedFiles[0]
      setFile(file)
    },
    [setFile],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    maxFiles: 1,
    multiple: false,
    onDrop,
    accept: AcceptedMimeTypes,
    maxSize: 51200, // 50KB
  })

  const onRemove = () => {
    setFile(undefined)
  }

  return (
    <>
      <FileUpload
        getRootProps={() => ({ ...getRootProps(), height: '228px' })}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isDragReject={isDragReject}
        fileInfo={fileInfo}
        onRemove={onRemove}
      />

      {fileRejections.length > 0 && fileRejections[0].errors.length > 0 ? (
        <Typography variant="body2" color="error">
          {fileRejections[0].errors[0].message}
        </Typography>
      ) : null}

      <Typography>
        <SvgIcon
          component={InfoIcon}
          inheritViewBox
          fontSize="small"
          color="border"
          sx={{
            verticalAlign: 'middle',
            mr: 0.5,
          }}
        />
        Supported Formats:{' '}
        {Object.values(AcceptedMimeTypes)
          .flat()
          .map((ext) => ext.replace('.', '').toUpperCase())
          .join(', ')}
      </Typography>
    </>
  )
}
