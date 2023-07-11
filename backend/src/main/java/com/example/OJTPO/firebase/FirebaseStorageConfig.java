package com.example.OJTPO.firebase;

import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Configuration
public class FirebaseStorageConfig {
  
  @Bean
  public Storage storage() throws IOException {
    StorageOptions storageOptions =
      StorageOptions.newBuilder()
        .setProjectId("avensys-po-mgmt")
        .setCredentials(GoogleCredentials.fromStream(
          new FileInputStream("./firebase-key.json")
        ))
        .build();

    return storageOptions.getService();
  }

}
