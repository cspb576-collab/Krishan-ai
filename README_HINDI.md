# Krishan AI – Photo Analyzer

यह एक mobile-friendly AI web app है। इसमें आप photo/screenshot/trading chart/document upload करके AI analysis ले सकते हैं।

## Features

- Photo और screenshot analysis
- OCR / visible text extraction
- Trading candlestick/chart analysis
- General object/scene explanation
- Hindi answers
- Follow-up question
- Public-information web search
- Copy result
- API key backend में सुरक्षित रखी जाती है; browser में सीधे नहीं जाती

## क्या यह किसी private व्यक्ति की पहचान बताएगा?

नहीं। App private person की face पहचान, private phone number, घर का पता, private social account या अन्य sensitive personal data निकालने के लिए नहीं बनाया गया है। Visible public text/सामान्य image description दी जा सकती है।

## चलाने का तरीका

1. Computer पर Node.js install करें।
2. इस folder में terminal खोलें।
3. `npm install`
4. `.env.example` की copy बनाकर `.env` नाम रखें।
5. `.env` में अपना OpenAI API key डालें:
   `OPENAI_API_KEY=...`
6. `npm start`
7. Browser में `http://localhost:3000` खोलें।

## Android पर

इस project को किसी Node-compatible hosting पर deploy करके Chrome से खोल सकते हैं और "Add to Home screen" कर सकते हैं। बाद में इसे Capacitor से APK में भी wrap किया जा सकता है।

## जरूरी बात

API key को कभी भी public HTML/JavaScript में मत डालें और chat में अपना API key मत भेजें।

Trading analysis केवल educational/technical interpretation है; guaranteed profit या निश्चित market outcome नहीं दिया जाता।
