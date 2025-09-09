export function convertSrtToVtt(srtContent: string): string {
  // Add WebVTT header
  let vttContent = 'WEBVTT\n\n';

  // Split into lines and process
  const lines = srtContent.trim().split('\n');
  let i = 0;

  while (i < lines.length) {
    // Skip subtitle number
    if (/^\d+$/.test(lines[i])) {
      i++;
      continue;
    }

    // Convert timestamp format from SRT to VTT
    // SRT: 00:00:20,000 --> 00:00:24,400
    // VTT: 00:00:20.000 --> 00:00:24.400
    if (lines[i].includes('-->')) {
      vttContent += lines[i].replace(/,/g, '.') + '\n';
      i++;
      continue;
    }

    // Add subtitle text
    vttContent += lines[i] + '\n';
    i++;

    // Add extra newline between entries
    if (i < lines.length && /^\d+$/.test(lines[i])) {
      vttContent += '\n';
    }
  }

  return vttContent;
} 