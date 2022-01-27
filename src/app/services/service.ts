import { KeycloakAdminRequest, KeycloakRequest } from "~/utils";

export class Service {
  constructor(
    protected readonly keycloakRequest = KeycloakRequest,
    protected readonly keycloakAdminRequest = KeycloakAdminRequest
  ) {}
}