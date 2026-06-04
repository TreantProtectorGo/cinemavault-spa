export function resolveAssetUrl(value: string | null | undefined, apiBaseUrl: string) {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  const assetPath = trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`;

  try {
    return `${new URL(apiBaseUrl).origin}${assetPath}`;
  } catch {
    return assetPath;
  }
}
