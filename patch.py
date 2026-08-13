with open("src/components/SnsShareGenerator.jsx", "r") as f:
    lines = f.readlines()

new_lines = []
use_effect = []
early_return = ""

in_effect = False
for line in lines:
    if line.startswith("  useEffect(() => {"):
        in_effect = True
        use_effect.append(line)
    elif in_effect:
        use_effect.append(line)
        if line.startswith("  }, [visible, photo, regionName, stats]);"):
            in_effect = False
    elif line.startswith("  if (!visible) return null;"):
        early_return = line
    else:
        new_lines.append(line)

# find index of `  const handleDownload = () => {`
idx = 0
for i, line in enumerate(new_lines):
    if line.startswith("  const handleDownload = () => {"):
        idx = i
        break

final_lines = new_lines[:idx] + use_effect + [early_return, "\n"] + new_lines[idx:]

with open("src/components/SnsShareGenerator.jsx", "w") as f:
    f.writelines(final_lines)
