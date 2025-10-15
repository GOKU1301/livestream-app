import subprocess
import os
from pathlib import Path
import logging
from datetime import UTC, datetime
import time

class RTSPHandler:
    def __init__(self):
        self.output_dir = Path("static/streams")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.process = None

    def convert_to_hls(self, rtsp_url):
        """Convert RTSP stream to HLS format"""
        try:
            output_path = str(self.output_dir / "stream.m3u8")
            
            # Kill any existing FFmpeg process
            if self.process and self.process.poll() is None:
                self.process.terminate()
                self.process.wait()

            # Get FFmpeg path from environment variables
            ffmpeg_path = os.getenv('FFMPEG_PATH', 'ffmpeg')
            
            # FFmpeg command with non-blocking output
            command = [
                ffmpeg_path,
                '-i', rtsp_url,
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-tune', 'zerolatency',
                '-c:a', 'aac',
                '-f', 'hls',
                '-hls_time', '2',
                '-hls_list_size', '10',
                '-hls_flags', 'delete_segments+append_list',
                output_path
            ]
            
            # Start FFmpeg process with PIPE (Windows creationflags used when available)
            creation_flags = 0
            try:
                creation_flags = subprocess.CREATE_NO_WINDOW
            except Exception:
                creation_flags = 0

            self.process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                creationflags=creation_flags
            )

            # Wait briefly for the manifest to be created so the frontend doesn't
            # immediately get a 404 when it requests the .m3u8 file.
            manifest = self.output_dir / "stream.m3u8"
            timeout_sec = 8
            poll_interval = 0.5
            waited = 0.0

            while waited < timeout_sec:
                if manifest.exists() and manifest.stat().st_size > 0:
                    return True

                # If the process exited early, capture stderr and fail
                if self.process.poll() is not None:
                    stderr = b''
                    try:
                        stderr = self.process.stderr.read() or b''
                    except Exception:
                        pass
                    logging.error(f"FFmpeg exited before creating manifest. stderr: {stderr.decode(errors='ignore')}")
                    return False

                time.sleep(poll_interval)
                waited += poll_interval

            # Timed out waiting for manifest
            logging.error("Timed out waiting for HLS manifest to be created")
            return False
        except Exception as e:
            logging.error(f"FFmpeg conversion failed: {str(e)}")
            return False