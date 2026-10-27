# Use when adding a VM: copy this block, replace every <placeholder>, keep the section order and the comments.

# =============================================================================
# <Service name> (<env>): <one line on what this VM runs>
# openspec change: <change-id>
# =============================================================================

module "<role>_<env>" {
  source = "./modules/<vm-module>"

  # Naming
  slug        = var.slug
  environment = "<env>"
  role        = "<role>" # the join key: inventory group, playbook, stack, workflow and secrets share it

  # Server config
  server_type       = "<type>" # <why this size: measured use, date>
  image             = "<image>"
  location          = var.location
  ssh_key_ids       = [<ssh-key-reference>]
  backups           = <true|false> # <change-id> DEC-<n>: <why>
  delete_protection = true
  keep_disk         = true # a resize never grows the disk, so a later downsize stays possible

  # Network
  network_id       = <network-reference>
  network_subnet   = <subnet-reference>
  network_ip_range = var.network_ip_range
  private_ip       = "<private-address>" # pinned: other layers and consumers point at it

  # Firewall (cloud firewall filters public traffic only; private ports: see infrastructure-security, exposure)
  public_app_ports     = [<public-ports>]     # the proxy only
  app_ports            = [<private-app-ports>] # <what listens, for whom>
  restricted_app_ports = [<restricted-ports>]  # <source list and why>; temporary sources carry: expires: YYYY-MM-DD

  # Monitoring
  expose_node_exporter = true
  monitoring_source_ip = var.<monitoring-source>

  # Volume (data lives here, under /opt/data)
  volume_size      = <size-gb> # <why this size>
  volume_format    = null      # formatted and mounted by Ansible (data volume role)
  volume_automount = false

  # Labels
  common_labels = local.common_labels
}
