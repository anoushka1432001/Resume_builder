import os
import subprocess
import tempfile
from pathlib import Path
import shutil
from starlette.background import BackgroundTask
from fastapi.responses import StreamingResponse

def generate_pdf_from_tex(tex_content: str, output_dir: str, filename: str) -> StreamingResponse:
    """
    Generates a PDF from a LaTeX string using xelatex.

    Args:
        tex_content (str): The LaTeX source code.
        output_dir (str): Directory to save the final PDF.
        filename (str): PDF filename (without extension).

    Returns:
        str: Full path to the generated PDF.
    """
    os.makedirs(output_dir, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmpdir:
        tex_file = os.path.join(tmpdir, f"{filename}.tex")
        
        # Write .tex file
        with open(tex_file, "w", encoding="utf-8") as f:
            f.write(tex_content)

        # Compile using xelatex
        try:
            subprocess.run(
                ["xelatex", "-interaction=nonstopmode", tex_file],
                cwd=tmpdir,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        except subprocess.CalledProcessError as e:
            print("[XeLaTeX STDOUT]:\n", e.stdout.decode())
            raise RuntimeError(f"LaTeX compilation failed. Please check your template. {e.stderr.decode()}")

        # Move resulting PDF to output_dir
        compiled_pdf = os.path.join(tmpdir, f"{filename}.pdf")
        if not os.path.exists(compiled_pdf):
            raise FileNotFoundError("PDF was not created by xelatex.")
        
        pdf_stream = open(compiled_pdf, "rb")

        return StreamingResponse(
            pdf_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume.pdf"},
            background=BackgroundTask(pdf_stream.close)
        )
