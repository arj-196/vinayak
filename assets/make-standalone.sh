#!/bin/sh
# The artifact platform wraps intake.html in a <!doctype>/<head>/<body> skeleton
# at publish time (adding charset + viewport), so the source file deliberately
# has no document wrapper. A file sent by email or WhatsApp gets no such wrapper,
# so generate a self-contained copy for that route.
#
# Run after any edit to intake.html:  sh assets/make-standalone.sh
set -e
DIR=$(dirname "$0")
python3 - "$DIR" <<'PY'
import sys, pathlib
d = pathlib.Path(sys.argv[1])
src = (d / "intake.html").read_text()
head, sep, rest = src.partition("</style>")
assert sep, "intake.html: expected a </style> to split head from body"
out = (
    '<!doctype html>\n<html lang="en">\n<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    '<meta name="color-scheme" content="light dark">\n'
    + head + sep + "\n</head>\n<body>\n"
    + rest.strip() + "\n</body>\n</html>\n"
)
(d.parent / "Claude-Setup-Check.html").write_text(out)
print("wrote Claude-Setup-Check.html")
PY
