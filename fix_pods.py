from pathlib import Path

path = Path("ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks.sh")

if not path.exists():
    raise SystemExit(f"File non trovato: {path}")

lines = path.read_text().splitlines()
out = []
i = 0
changed = False

while i < len(lines):
    line = lines[i]

    if line.strip() == 'if [ -L "${source}" ]; then':
        # Sostituisce tutto il blocco corrotto fino al relativo "fi"
        out.append('  if [ -L "${source}" ]; then')
        out.append('    echo "Symlinked..."')
        out.append('    source="$(python3 -c \'import os,sys; print(os.path.realpath(sys.argv[1]))\' "${source}")"')
        out.append('  fi')

        i += 1
        while i < len(lines) and lines[i].strip() != "fi":
            i += 1

        if i < len(lines) and lines[i].strip() == "fi":
            i += 1

        changed = True
        continue

    out.append(line)
    i += 1

path.write_text("\n".join(out) + "\n")

if changed:
    print("Blocco Symlinked corretto.")
else:
    print("Nessun blocco Symlinked trovato.")
