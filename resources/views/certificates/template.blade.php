<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sertifikat {{ $data['participant_name'] }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            width: 297mm;
            height: 210mm;
            position: relative;
            overflow: hidden;
            background-image: url("{{ public_path('storage/' . $certificate->design->image_1) }}");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .certificate-container {
            width: 100%;
            position: relative;
            padding: 9mm;
            margin-left: 15mm;
        }

        .certificate-content {
            width: 110%;
            max-width: 310mm;
            padding: 100px 0px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .header {
            margin-bottom: 15px;
        }

        .header-top {
            font-size: 48px;
            text-transform: uppercase;
            font-weight: bold;
        }

        .header-bottom {
            font-size: 56px;
            margin-bottom: 50px;
        }

        .certificate-title {
            font-size: 170px;
            font-weight: bold;
            color: #003986;
            text-transform: uppercase;
            max-width: 1720px;
            line-height: 1;
            margin-bottom: 30px;
        }

        .certificate-subtitle {
            font-size: 56px;
            margin-bottom: 130px;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 32px;
        }

        .content-text {
            font-size: 60px;
            margin-top: 52px;
            margin-bottom: 24px;
        }

        .participant-name {
            font-size: 110px;
            font-weight: bold;
            text-transform: uppercase;
            color: #003986;
            display: inline-block;
            min-width: 250px;
            border-bottom: 4px solid #003986;
            margin-bottom: 48px;
        }

        .program-name {
            color: #003986;
            font-style: italic;
            display: block;
            margin-top: 24px;
            font-size: 48px;
        }

        .program-description {
            font-size: 48px;
            font-weight: bold;
        }

        .description {
            font-size: 60px;
            max-width: 1300px;
        }

        .period {
            font-size: 48px;
            color: #9ca3af;
            margin-top: 24px;
            font-style: italic;
        }

        .footer {
            position: relative;
            margin-top: 120px;
            height: 120px;
            clear: both;
        }

        .signature-container {
            float: left;
            width: 50%;
            text-align: left;
        }

        .period-section {
            float: right;
            width: 50%;
            text-align: right;
            margin-top: 40px;
            margin-right: 600px;
        }

        .qr-container {
            margin-bottom: 16px;
            position: relative;
            text-align: right;
        }

        .qr-code {
            width: 200px;
            height: 200px;
            margin: 0 0 16px auto;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 4px;
            background: white;
            display: block;
        }

        .qr-placeholder {
            width: 200px;
            height: 200px;
            margin: 0 auto 16px auto;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            background: #f9fafb;
            font-size: 24px;
            display: block;
        }

        .certificate-url {
            font-size: 48px;
            color: #003986;
            font-weight: bold;
        }

        .certificate-period {
            font-size: 48px;
            margin-bottom: 2px;
        }

        .signature-space {
            width: 150px;
            height: 200px;
            margin-bottom: 8px;
            position: relative;
        }

        .signature-image {
            max-width: 700px;
            max-height: 700px;
            object-fit: contain;
        }

        .signature-name {
            font-size: 48px;
            font-weight: bold;
            color: #003986;
            margin-bottom: 2px;
            text-decoration: underline;
        }

        .signature-title,
        .signature-date {
            font-size: 56px;
        }

        /* Clearfix untuk footer */
        .footer::after {
            content: "";
            display: table;
            clear: both;
        }

        /* Print optimization */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>

<body>
    <div class="certificate-container">
        <div class="certificate-content">
            {{-- Header --}}
            <div class="header">
                @if ($certificate->header_top)
                    {{-- <div class="header-top">{{ $certificate->header_top }}</div> --}}
                @endif

                @if ($certificate->header_bottom)
                    <div class="header-bottom">NOMOR IZIN KEMENKUMHAM {{ $certificate->header_bottom }}</div>
                @endif

                <div class="certificate-title">CERTIFICATE OF ACHIEVEMENT</div>
                <div class="certificate-subtitle">
                    {{ sprintf('%04d', $data['certificate_number']) }}/{{ $certificate->certificate_number }}
                </div>
            </div>

            {{-- Content --}}
            <div class="content">
                <div class="content-text">This certificate is proudly presented to</div>

                <div class="participant-name">
                    {{ $data['participant_name'] }}
                </div>

                @if ($certificate->description)
                    <div class="description">
                        {{ $certificate->description }}
                    </div>
                @endif
            </div>

            {{-- Footer --}}
            <div class="footer">
                <div class="signature-container">
                    <div class="signature-date">Malang,
                        {{ \Carbon\Carbon::parse($certificate->issued_date)->locale('id')->translatedFormat('d F Y') }}
                    </div>
                    <div class="signature-space">
                        @if ($certificate->sign && $certificate->sign->image)
                            <img src="{{ public_path('storage/' . $certificate->sign->image) }}" alt="Tanda Tangan"
                                class="signature-image">
                        @else
                            <div style="color: #9ca3af; font-style: italic; font-size: 10px;">Tanda Tangan</div>
                        @endif
                    </div>

                    @if ($certificate->sign)
                        <div class="signature-name">{{ $certificate->sign->name }}</div>
                        <div class="signature-title">
                            {{ $certificate->sign->position ?? 'Direktur CV. Arsa Cendekia' }}
                        </div>
                    @else
                        <div class="signature-name">Direktur</div>
                        <div class="signature-title">CV. Arsa Cendekia</div>
                    @endif
                </div>

                <div class="period-section">
                    {{-- QR Code Section --}}
                    <div class="qr-container">
                        @if ($qrCode)
                            <div class="qr-code">
                                @if (str_contains($qrCode, 'image/png'))
                                    <img src="{{ $qrCode }}" alt="QR Code"
                                        style="width: 100%; height: 100%; object-fit: contain;">
                                @else
                                    {!! $qrCode !!}
                                @endif
                            </div>
                        @else
                            <div class="qr-placeholder">
                                QR Code<br>Not Available
                            </div>
                        @endif

                        @if ($certificateUrl)
                            <div class="certificate-url">{{ $certificateUrl }}</div>
                        @else
                            <div class="certificate-url">
                                https://arsacendekia.com/certificate/{{ $data['certificate_code'] }}
                            </div>
                        @endif
                    </div>

                    <div class="certificate-period">{{ $certificate->period }}</div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
