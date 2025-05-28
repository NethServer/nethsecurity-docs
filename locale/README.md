# Documentation Translation with AI

This guide provides instructions on how to translate Sphinx documentation using AI tools, specifically OpenAI or GitHub models.

Supported Languages:
- Italian (it)

1. Create all the necessary directories:
```bash
sphinx-build -b gettext . locale/pot/
```
2. Translate using AI:
```bash
cd locale
pip install -r requirements.txt
```

To use OpenAI for translation, you need to set the `OPENAI_API_KEY` environment variable. You can do this by running the following command in your terminal:
```
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY ai_translate.py
```

If you want to use GitHub models, set the `GITHUB_TOKEN` environment variable:
```bash
GITHUB_TOKEN=$(gh auth token) ai_translate.py
```
3. Build the translated documentation:
```bash
 sphinx-build -b html -D language=it . _build/html/it
```
