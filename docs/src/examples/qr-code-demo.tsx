import { QrCode } from 'shadcn-solid-components/components/qr-code'

const QrCodeDemo = () => {
  return (
    <div class="flex justify-center">
      <QrCode value="https://github.com/vgerbot-libraries/shadcn-solid-components" size={220} />
    </div>
  )
}

export default QrCodeDemo
