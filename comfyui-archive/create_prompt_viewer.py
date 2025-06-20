import pandas as pd
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
PROMPTS_CSV = SCRIPT_DIR / "product-prompts.csv"
OUTPUT_HTML = SCRIPT_DIR / "prompt_viewer.html"

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Prompts Viewer</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 2rem;
            background-color: #f8f9fa;
            color: #333;
        }}
        h1 {{
            text-align: center;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            background: white;
        }}
        th, td {{
            padding: 12px 15px;
            border: 1px solid #dee2e6;
            text-align: left;
            vertical-align: top;
        }}
        th {{
            background-color: #e9ecef;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        tr:hover {{
            background-color: #d4edda;
        }}
        td:nth-child(3) {{
             max-width: 600px;
             word-wrap: break-word;
        }}
    </style>
</head>
<body>
    <h1>Product Prompts</h1>
    {table}
</body>
</html>
"""

def create_html_viewer():
    try:
        print(f"Reading prompts from: {PROMPTS_CSV}")
        df = pd.read_csv(PROMPTS_CSV)
        html_table = df.to_html(index=False, classes="table", border=0)
        final_html = HTML_TEMPLATE.format(table=html_table)
        with open(OUTPUT_HTML, 'w') as f:
            f.write(final_html)
        print(f"✅ Successfully created HTML viewer: {OUTPUT_HTML}")
    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    create_html_viewer() 