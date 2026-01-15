import anthropic

# Read API key from .env
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('ANTHROPIC_API_KEY='):
            api_key = line.split('=', 1)[1].strip()
            break

client = anthropic.Anthropic(api_key=api_key)

# Test models to check
models_to_test = [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-20241022",
]

print("Testing which Claude models are available with your API key...\n")
print("="*70)

available_models = []
for model in models_to_test:
    try:
        # Try a simple text-only request (cheaper than vision)
        response = client.messages.create(
            model=model,
            max_tokens=10,
            messages=[{"role": "user", "content": "Hello"}]
        )
        print(f"[OK] {model:40} AVAILABLE")
        available_models.append(model)
    except anthropic.NotFoundError:
        print(f"[NO] {model:40} NOT AVAILABLE (404)")
    except anthropic.PermissionDeniedError:
        print(f"[NO] {model:40} PERMISSION DENIED")
    except anthropic.AuthenticationError:
        print(f"[NO] {model:40} AUTHENTICATION ERROR")
    except Exception as e:
        print(f"? {model:40} ERROR: {type(e).__name__}")

print("="*70)
print(f"\nAvailable models: {len(available_models)}")

if len(available_models) == 0:
    print("\nWARNING: NO MODELS AVAILABLE!")
    print("This means your API key might be:")
    print("  1. Invalid or expired")
    print("  2. On a free tier without model access")
    print("  3. Missing required billing/credits")
    print("\nGo to: https://console.anthropic.com/settings/billing")
    print("Add at least $5 in credits to enable model access.")
elif any("opus" in m or "sonnet" in m or "haiku" in m for m in available_models):
    print("\nSUCCESS: You have access to Claude models!")
    print(f"Recommended for vision: {available_models[0]}")
else:
    print("\nWARNING: Limited model access detected")
