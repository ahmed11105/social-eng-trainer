import hashlib, sys, re
from itertools import product

# Load target hash
target = open("hash.txt").read().strip()

# Load clue words
words = open("words.txt").read().strip().split("\n")

# Leetspeak map (from How to Play: e->3, a->4, i->1, o->0, s->5, t->7)
leet_map = {'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7'}

# Special chars that go at the end
special_chars = ['!', '@', '#', '$', '*']

# Separators
separators = ['_', '-', '.']

def capitalize(pw):
    """Capitalize first letter of each word part (split on numbers)"""
    parts = re.split(r'(\d+)', pw)
    result = ""
    for part in parts:
        if part.isdigit() or len(part) == 0:
            result += part
        else:
            result += part[0].upper() + part[1:]
    return result

def apply_leetspeak_variants(pw):
    """Generate all possible leetspeak variants (replacing 0 to all occurrences of each letter)"""
    # Find which leet-eligible letters exist in the password (case-insensitive)
    eligible = []
    for letter in leet_map:
        if letter in pw.lower():
            eligible.append(letter)

    # For each eligible letter, we can either replace all occurrences or not
    # This gives us 2^n combinations
    variants = set()
    for combo in product([False, True], repeat=len(eligible)):
        variant = pw
        for i, do_replace in enumerate(combo):
            if do_replace:
                letter = eligible[i]
                # Replace all occurrences (case-insensitive)
                variant = re.sub(letter, leet_map[letter], variant, flags=re.IGNORECASE)
        variants.add(variant)

    return variants

def check(candidate):
    h = hashlib.sha256(candidate.encode()).hexdigest()
    if h == target:
        print(f"CRACKED: {candidate}")
        sys.exit(0)

# Build all two-part base combinations
bases = []
for a in words:
    for b in words:
        if a != b:
            bases.append(a.lower() + b.lower())

print(f"Trying {len(bases)} base combinations...")
count = 0

for base in bases:
    cap = capitalize(base)

    for special in special_chars:
        with_special = cap + special

        # PATH 1: Leetspeak variants (no separator)
        for variant in apply_leetspeak_variants(with_special):
            check(variant)
            count += 1

        # PATH 2: Separator at each position (no leetspeak)
        for sep in separators:
            # Insert separator at each position (excluding the special char at end)
            base_part = cap  # without special char
            for i in range(1, len(base_part)):
                candidate = base_part[:i] + sep + base_part[i:] + special
                check(candidate)
                count += 1

print(f"Not cracked after {count} attempts. Add more words to words.txt")
