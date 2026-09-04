#!/usr/bin/env bash
#
# AI Faculty — launch handover
# Shows current progress, what needs your one-time login, and how to
# switch from the free *.pages.dev URL to aifaculty.org when ready.
#
# Usage:
#   ./handover.sh            # show full status
#   ./handover.sh --todo     # show only outstanding steps
#   ./handover.sh --days     # days until countdown target
#
set -euo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATUS_FILE="$SELF_DIR/launch-status.json"

if [[ ! -f "$STATUS_FILE" ]]; then
  echo "ERROR: $STATUS_FILE not found next to this script." >&2
  exit 1
fi

cd "$SELF_DIR"

# --- colour helpers ---
c_done="\e[32m"; c_warn="\e[33m"; c_dim="\e[2m"; c_bold="\e[1m"; c_reset="\e[0m"

count() { python3 -c "import json,sys;d=json.load(open('$STATUS_FILE'));k='$1';print(str(d[k]).lower())"; }
list_steps() { python3 -c "import json;d=json.load(open('$STATUS_FILE'));[print(json.dumps(s)) for s in d['steps']]"; }

show_status() {
  echo
  echo -e "${c_bold}AI Faculty — launch handover${c_reset}"
  echo -e "  Countdown target:  $(count countdown_target)"
  echo -e "  Offer:             $(count offer)"
  echo -e "  Domain:            $(count domain)  (~\$$(count domain_cost_per_year_usd)/yr, $(count registrar))"
  echo -e "  Total required cost to go live: \$$(count domain_cost_per_year_usd)/yr  (everything else free)"
  echo

  echo -e "${c_bold}Progress${c_reset}"
  echo -e "  $(count_done) of $(count_total) steps complete"
  echo

  echo -e "${c_bold}Step-by-step${c_reset}"
  python3 -c "
import json
d=json.load(open('$STATUS_FILE'))
done=[s['id'] for s in d['steps'] if s['status']=='done']
for i,s in enumerate(d['steps'],1):
    mark='DONE' if s['status']=='done' else 'TODO'
    tag='\033[32m[DONE]\033[0m' if s['status']=='done' else ('\033[31m[TODO]\033[0m' if s['cost']>0 else '\033[33m[free]\033[0m')
    print(f'  {tag} {i}. {s[\"label\"]}')
    print(f'         {s[\"notes\"]}')
"
}

count_done() { python3 -c "import json;d=json.load(open('$STATUS_FILE'));print(sum(1 for s in d['steps'] if s['status']=='done'))"; }
count_total() { python3 -c "import json;d=json.load(open('$STATUS_FILE'));print(len(d['steps']))"; }

show_todo() {
  echo -e "${c_bold}Outstanding steps (in order)${c_reset}"
  python3 -c "
import json
d=json.load(open('$STATUS_FILE'))
for s in d['steps']:
    if s['status']!='done':
        who='YOUR one-time browser login (Cloudflare)' if s['id'] in ('pages_free',) else ('Register domain at dash.cloudflare.com' if s['id']=='domain' else 'CLI, I can guide/help')
        print(f'  - {s[\"label\"]}   [{who}]')
        print(f'      {s[\"notes\"]}')
"
  echo
  echo -e "${c_dim}Full commands for the Worker steps live in workers/signup/README.md${c_reset}"
}

show_days() {
  python3 -c "
import json,datetime
d=json.load(open('$STATUS_FILE'))
t=d['countdown_target']
dt=datetime.datetime.fromisoformat(t.replace('Z','+00:00'))
days=(dt-datetime.datetime.now(datetime.timezone.utc)).days
print(f'{days} days until launch ({t})')
"
}

case "${1:-}" in
  --todo) show_todo ;;
  --days) show_days ;;
  "")     show_status ;;
  *) echo "unknown flag: $1" >&2; exit 1 ;;
esac
