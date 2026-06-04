import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Descriptions,
  Result,
  Skeleton,
  Space,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import { getApiErrorMessage } from "../api/client";
import { uploadProfilePhoto } from "../api/profile";
import { useAuth } from "../hooks/useAuth";
import { useApiBaseUrl } from "../hooks/useApiBaseUrl";
import type { UserPublic } from "../types";

const allowedAvatarTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarSizeBytes = 2 * 1024 * 1024;

function resolveProfilePhotoUrl(value: string | null | undefined, apiBaseUrl: string) {
  if (!value) {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return new URL(value, apiBaseUrl).toString();
}

export function ProfilePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { refreshUser, user } = useAuth();
  const apiBaseUrl = useApiBaseUrl();
  const [profile, setProfile] = useState<UserPublic | null>(user);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const avatarUrl = useMemo(
    () => resolveProfilePhotoUrl(profile?.profilePhotoUrl, apiBaseUrl),
    [apiBaseUrl, profile?.profilePhotoUrl],
  );

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await refreshUser();
      setProfile(result);
    } catch (error) {
      setProfile(null);
      setErrorMessage(`${getApiErrorMessage(error)} Please login again if your session expired.`);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleUpload(file: File) {
    if (!allowedAvatarTypes.has(file.type)) {
      messageApi.error("Please choose a JPG, PNG, or WEBP image.");
      return Upload.LIST_IGNORE;
    }

    if (file.size > maxAvatarSizeBytes) {
      messageApi.error("Profile photo must be 2MB or smaller.");
      return Upload.LIST_IGNORE;
    }

    setIsUploading(true);

    try {
      const updatedProfile = await uploadProfilePhoto(file);
      setProfile(updatedProfile);
      await refreshUser();
      messageApi.success("Profile photo updated.");
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsUploading(false);
    }

    return Upload.LIST_IGNORE;
  }

  return (
    <section className="page-stack">
      {contextHolder}
      <div className="page-heading">
        <h1>Profile</h1>
        <p>Review your CinemaVault account details and update your profile photo.</p>
      </div>

      {errorMessage ? (
        <Alert showIcon type="error" title="Could not load profile" description={errorMessage} />
      ) : null}

      <Card className="profile-card">
        {isLoading ? (
          <Skeleton active avatar paragraph={{ rows: 5 }} />
        ) : profile ? (
          <div className="profile-layout">
            <div className="profile-avatar-panel">
              <Avatar
                className="profile-avatar"
                icon={<UserOutlined />}
                src={avatarUrl}
              />
              <Space orientation="vertical" align="center">
                <Typography.Text strong>{profile.displayName || profile.username}</Typography.Text>
                <Tag color={profile.role === "ADMIN" ? "red" : "blue"}>{profile.role}</Tag>
              </Space>
              <Upload
                accept="image/jpeg,image/png,image/webp"
                beforeUpload={(file) => handleUpload(file)}
                disabled={isUploading}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} loading={isUploading} type="primary">
                  Upload avatar
                </Button>
              </Upload>
              <Typography.Text className="profile-upload-note" type="secondary">
                JPG, PNG, or WEBP. Maximum 2MB.
              </Typography.Text>
            </div>

            <div className="profile-detail-panel">
              <Descriptions
                bordered
                column={1}
                items={[
                  {
                    key: "username",
                    label: "Username",
                    children: profile.username,
                  },
                  {
                    key: "email",
                    label: "Email",
                    children: profile.email,
                  },
                  {
                    key: "role",
                    label: "Role",
                    children: (
                      <Tag color={profile.role === "ADMIN" ? "red" : "blue"}>
                        {profile.role}
                      </Tag>
                    ),
                  },
                  {
                    key: "displayName",
                    label: "Display name",
                    children: profile.displayName || "Not set",
                  },
                  {
                    key: "profilePhotoUrl",
                    label: "Profile photo",
                    children: profile.profilePhotoUrl || "Not uploaded",
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          <Result
            status="warning"
            title="Profile unavailable"
            subTitle="Please login again to view your account profile."
          />
        )}
      </Card>
    </section>
  );
}
